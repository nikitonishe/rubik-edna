const { Kubik } = require('rubik-main');
const isObject = require('lodash/isObject');
const crypto = require('crypto');
const fetch = require('node-fetch');
const set = require('lodash/set');

const methods = require('./Edna/methods');

const EdnaError = require('../errors/EdnaError');

const DEFAULT_HOST = 'https://im.edna.ru/';

/**
 * Кубик для запросов к API Edna
 * @class
 * @prop {String} [token] токен для доступа к API
 * @prop {String} [host=DEFAULT_HOST] адрес API Edna
 */
class Edna extends Kubik {
  constructor(token, host) {
    super(...arguments);
    this.token = token || null;
    this.host = host || null;

    this.methods.forEach(this.generateMethod, this);
  }

  /**
   * Поднять кубик
   * @param  {Object} dependencies зависимости
   */
  up({ config }) {
    this.config = config;

    const options = this.config.get(this.name);

    this.token = this.token || options.token || null;
    this.host = this.host || options.host || DEFAULT_HOST;
  }

  getUrl({ path, host }) {
    if (!host) host = this.host;
    if (!host) throw new TypeError('host is not defined');

    return `${host}api/${path}`;
  }

  /**
   * Сделать запрос к API Edna
   * @param  {String} name  имя метода
   * @param  {Object|String} body тело запроса
   * @param  {String} [token=this.token] токен для запроса
   * @param  {String} [host=this.host] хост API Viber
   * @return {Promise<Object>} ответ от Edna API
   */
  async request({ path, body, token, host }) {
    const url = this.getUrl({ path, host });
    let method = 'GET';

    if (!token) token = this.token;
    const headers = { 'X-API-KEY': token };

    if (isObject(body)) {
      if (!body.id) body.id = `${Date.now().toString(16)}-${crypto.randomInt(65536).toString(16)}`;

      body = JSON.stringify(body);
      headers['content-type'] = 'application/json'
    }

    if (body) method = 'POST';

    const request = await fetch(url, { method, body, headers });
    const result = await request.json();

    if (result.code !== 'ok') throw new EdnaError(result.code);

    return result;
  }

  /**
   * Сгенерировать метод API
   *
   * Создает функцию для запроса к API, привязывает ее к текущему контексту
   * и кладет в семантичное имя внутри this.
   * В итоге он разбирет путь на части, и раскладывает его по семантичным объектам:
   * one/two/three -> this.one.two.three(currency, body, id);
   * @param  {String}  path путь запроса, без ведущего /: one/two/three
   */
  generateMethod({ kubikName, apiName }) {
    const method = (options) => {
      if (!options) options = {};
      const { params, body, token, host } = options;
      return this.request({ path: apiName, body, params, token, host });
    };
    set(this, kubikName, method);
  }
}

// Чтобы не создавать при каждой инициализации класса,
// пишем значения имени и зависимостей в протип
Edna.prototype.dependencies = Object.freeze(['config']);
Edna.prototype.methods = Object.freeze(methods);
Edna.prototype.name = 'edna';

module.exports = Edna;

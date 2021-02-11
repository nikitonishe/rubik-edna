/* global describe test expect */
const path = require('path');
const { Kubiks: { Config } } = require('rubik-main');

const { createApp, createKubik } = require('rubik-main/tests/helpers/creators');

const Edna = require('../classes/Edna.js');

const CONFIG_VOLUMES = [
  path.join(__dirname, '../default/'),
  path.join(__dirname, '../config/')
];

const get = () => {
  const app = createApp();
  app.add(new Config(CONFIG_VOLUMES));

  const kubik = createKubik(Edna, app);

  return { app, kubik };
}

describe('Кубик для работы с Edna', () => {
  test('Создается без проблем и добавляется в App', () => {
    const { app, kubik } = get();
    expect(app.edna).toBe(kubik);
    expect(app.get('edna')).toBe(kubik);
  });

  test('Пробует отправить сообщение (не забудьте добавить токен в настройки)', async () => {
    const { app, kubik } = get();
    await app.up();
    const dataForTests = app.config.get('dataForTests');

    const response = await kubik.imOutMessage({
      body: {
        subject: 'MFMS_TEST3_WA',
        address: dataForTests.address,
        text: 'Тестовое сообщение',
        contentType: 'text'
      }
    });

    expect(response.code).toBe('ok');

    await app.down();
  });

  test('Пробует отправить шаблонное сообщение (не забудьте добавить токен в настройки)', async () => {
    const { app, kubik } = get();
    await app.up();
    const dataForTests = app.config.get('dataForTests');

    const response = await kubik.imOutHSM({
      body: {
        subject: 'MFMS_TEST3_WA',
        address: dataForTests.address,
        text: 'Тестовое шаблонное сообщение',
        contentType: 'text'
      }
    });

    expect(response.code).toBe('ok');

    await app.down();
  });

});

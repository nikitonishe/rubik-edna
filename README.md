# rubik-edna
Edna's Bot API kubik for the Rubik

## Install

### npm
```bash
npm i rubik-edna
```

### yarn
```bash
yarn add rubik-edna
```

## Use
```js
const { App, Kubiks } = require('rubik-main');
const Edna = require('rubik-edna');
const path = require('path');

// create rubik app
const app = new App();
// config need for most modules
const config = new Kubiks.Config(path.join(__dirname, './config/'));

const edna = new Edna();

app.add([ config, edna ]);

app.up().
then(() => console.info('App started')).
catch(err => console.error(err));
```

## Config
`edna.js` config in configs volume may contain the host and token.

If you do not specify a host, then `https://im.edna.ru` will be used by default.

If you don't specify a token, you will need to pass it.
```js
...
const response = await app.get('edna').imOutMessage({
  id: '',
  subject: 'test',
  address: '79001112233',
  priority: 'high',
  text: 'text'
  contentType: 'text'
});
...
```

You may need the host option if for some reason Edna host is not available from your server
and you want to configure a proxy server.


For example:
`config/edna.js`
```js
module.exports = {
  host: 'https://my.edna.proxy.example.com/'
};
```

## Extensions
Edna kubik doesn't has any extension.

require('babel-polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT,
  // database: 'localhost/clientShopDb',
  // database: 'mongodb://login:pass@ds011241.mlab.com:11241/trueshop1997',
  database: 'mongodb://main:mainmain@ds035995.mlab.com:35995/trueshop1997db',
  bankAPIKey: 'Bearer 374d4b32-7d0a-42af-88cb-046368e1b6df',
  bankAPIHost: 'https://bankapi1997.herokuapp.com',
  secret: 'verysecretkey',
  verifyEmailId: 'asd8asdh2nuew7qrjk236tk9e8rwh',
  app: {
    title: 'TrueShop1997',
    description: 'All the modern best practices in one example.',
    head: {
      titleTemplate: 'TrueShop1997: %s',
      meta: [
        {name: 'description', content: 'All the modern best practices in one example.'},
        {charset: 'utf-8'},
        {property: 'og:site_name', content: 'React Redux Example'},
        {property: 'og:image', content: 'https://react-redux.herokuapp.com/logo.jpg'},
        {property: 'og:locale', content: 'en_US'},
        {property: 'og:title', content: 'React Redux Example'},
        {property: 'og:description', content: 'All the modern best practices in one example.'},
        {property: 'og:card', content: 'summary'},
        {property: 'og:site', content: '@erikras'},
        {property: 'og:creator', content: '@erikras'},
        {property: 'og:image:width', content: '200'},
        {property: 'og:image:height', content: '200'}
      ]
    }
  },

}, environment);

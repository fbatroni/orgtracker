require('dotenv').config();
require('./globals');

const ExpressConfig = require('./config/express').default;
const express = require('express');
const app = express(); // Express App
// app settings
const expressConfig = new ExpressConfig(app);
expressConfig
  .appSettings()
  .parsers()
  .compression()
  .applyHeaders()
  .setupAppLogger()
  .session()
  .setupRoutes()
  .errorHandling()
  .enableLocalDev();
// separate http server concerns away from the express configuration
const server = require('./server')(expressConfig);

module.exports = server;

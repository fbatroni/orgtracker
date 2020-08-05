import appConfig from './app';
import RouteManager from '../api/route-manager';
import { sessionExpiryInMilliseconds } from './session';

const path = require('path');
const env = process.env.NODE_ENV || 'development';
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const compression = require('compression');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const childProcess = require('child_process');
const cookieParser = require('cookie-parser');
const crossDomain = require('cors');
const requestId = require('../middleware/request-id');
const errorHandler = require('errorhandler');
const isProd = process.env.NODE_ENV === 'production';
const expressWinston = require('express-winston');
const winston = require('winston');

class ExpressConfig {
  constructor(app) {
    this.app = app;
    this.routeManager = new RouteManager(app);
    this.isDev = process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'test';
    this.root = path.resolve(__dirname + '/../..');
    this.source = isProd ? 'dist' : 'src';
  }

  appSettings() {
    const { app } = this;
    const { port } = appConfig;
    // app settings
    app.set('env', env);
    app.set('port', port || 9191);
    app.enable('trust proxy');
    app.set('showStackError', process.env.NODE_ENV !== 'production');

    return this;
  }

  parsers() {
    const { app } = this;
    const { appSecret } = appConfig;

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(bodyParser.raw({ limit: '100mb' }));
    app.use(cookieParser(appSecret));

    return this;
  }

  compression() {
    const { app } = this;

    app.use(compression());

    return this;
  }

  applyHeaders() {
    const { app } = this;

    // app-related headers
    app.use(requestId());
    app.use(crossDomain());

    // security-related headers
    const helmetMiddleware = helmet({
      // By default Helmet adds X-DNS-Prefetch-Control: off header, which disables DNS prefetch.
      // DNS Prefetch is an optimization that we may want to use.
      dnsPrefetchControl: false,
      frameguard: {
        action: 'sameorigin', // "X-Frame-Options": "SAMEORIGIN",
      },
      upgradeInsecureRequests: 1,
    });
    app.use(helmetMiddleware);
    // Mitigate some XSS attacks
    app.use(helmet.xssFilter());
    // No Mimetype sniffing
    app.use(helmet.noSniff());
    app.use(helmet.hidePoweredBy());

    return this;
  }

  session() {
    const { app } = this;
    const { appSecret } = appConfig;
    const client = sessionCache.getClient();

    app.use(
      session({
        secret: appSecret,
        // create new redis store.
        store: new RedisStore({ client }),
        saveUninitialized: true, // save new sessions
        resave: true, // do not automatically write to the session store
        name: '_orgtracker_app',
        cookie: {
          secure: true,
          maxAge: sessionExpiryInMilliseconds, // 5 minutes
        },
      }),
    );

    return this;
  }

  errorHandling() {
    const { app } = this;
    app.use(errorHandler());
    process.on('unhandledRejection', (reason, p) => {
      console.log('Unhandled error::  at: Promise:: ');
      console.log(p);
      console.log(reason.stack || reason);
    });

    return this;
  }

  setupAppLogger() {
    const { app } = this;

    app.use(
      expressWinston.logger({
        transports: [
          new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true,
            silent: process.env.NODE_ENV === 'test' ? true : false,
          }),
        ],
        format: winston.format.combine(winston.format.colorize(), winston.format.json()),
        meta: true,
        msg: 'HTTP {{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}',
        expressFormat: true,
        colorize: true,
        ignoreRoute: function (req, res) {
          return false;
        },
      }),
    );

    return this;
  }

  /* eslint-disable no-console */
  enableLocalDev() {
    const { isDev } = this;
    // Redis for local development
    if (isDev) {
      console.log(childProcess.execSync('sh ./scripts/redis_start.sh').toString());
      console.log(childProcess.execSync('sh ./scripts/postgres_start.sh').toString());
      process.once('SIGINT', () => {
        console.log(childProcess.execSync('sh ./scripts/redis_stop.sh')).toString();
        console.log(childProcess.execSync('sh ./scripts/postgres_stop.sh')).toString();
        process.exit(1);
      });
    }

    return this;
  }

  setupRoutes() {
    const { app, routeManager } = this;

    // setup server side routes
    routeManager.configureRoutes();

    return this;
  }
}

export default ExpressConfig;

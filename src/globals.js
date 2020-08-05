const DBManager = require('./lib/db-manager').default;
const CacheManager = require('./lib/cache-manager').default;

global.sessionCache = CacheManager.getInstance();
global.dbManager = DBManager.getInstance();

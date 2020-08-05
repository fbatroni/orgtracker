import appConfig from './config/app';
const http = require('http');

module.exports = (config) => {
  const { app } = config;
  const { port, name } = appConfig;
  // Enable HTTPS in development, HTTP in other environments
  const server = http.createServer();
  server
    .on('request', app)
    .on('listening', function () {
      const addr = this.address();
      const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
      console.log(`Listening on ${bind}`);
    })
    .on('error', function (error) {
      if (error.syscall !== 'listen') throw error;
      const addr = this.address() || { port };
      const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
      switch (error.code) {
        case 'EACCES':
          console.log(`${bind} requires elevated privileges`);
          process.exit(1);
        case 'EADDRINUSE':
          lconsole.log(`${bind} is already in use`);
          process.exit(1);
        default:
          throw error;
      }
    });

  if (process.env.NODE_ENV !== 'test') {
    const eraseDatabaseOnSync = false;

    dbManager
      .getSequelizeClient()
      .sync({ force: eraseDatabaseOnSync })
      .then(async () => {
        server.listen(port, () => console.log(`${name} is listening on port ${port}`));
      });
  }
  return server;
};

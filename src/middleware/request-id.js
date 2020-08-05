const uuid = require('uuid/v4');

module.exports = () => {
  return async (req, res, next) => {
    req.orgTrackerRequestId = uuid();
    res.set('x-oauth-request-id', req.orgTrackerRequestId);
    await next();
  };
};

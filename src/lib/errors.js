import uuid from 'uuid';

const ErrorCodes = {
  ERR_ISE: 'orgtracker.error.InternalServer',
  ERR_API: 'orgtracker.error.API',
  ERR_VALIDATE: 'orgtracker.error.Validation',
  ERR_INVALID_CONTEXT: 'orgtracker.error.InvalidContext',
};
const http = require('http');
const statusCodes = http.STATUS_CODES;
const formatHttpError = (err, req, res) => {
  const { message, errorType: type, errorId } = err;
  const { orgTrackerRequestId } = req;
  const statusCode = res.statusCode ? res.statusCode : err.statusCode;

  return {
    error: {
      message,
      type: type || ErrorCodes['ERR_ISE'],
      code: statusCode,
      status: statusCodes[statusCode],
      errorId,
      orgTrackerRequestId,
    },
  };
};
class OrgTrackerError extends Error {
  constructor(message, details, errorType) {
    super();
    this.errorType = errorType;
    this.errorId = uuid.v4();
    this.message = message;
    this.name = this.constructor.name;
    this.details = details;
    this.stack = new Error().stack;
  }
}
class ValidationError extends OrgTrackerError {
  constructor(message, details, errorType = ErrorCodes.ERR_VALIDATE) {
    super(message, details, errorType);
    this.statusCode = 400;
  }
}

class InternalApiError extends OrgTrackerError {
  constructor(message, details, errorType = ErrorCodes.ERR_API) {
    super(message, details, errorType);
    this.statusCode = 500;
  }
}

class InvalidRequestContextError extends OrgTrackerError {
  constructor(message, details, errorType = ErrorCodes.ERR_INVALID_CONTEXT) {
    super(message, details, errorType);
    this.statusCode = 400;
  }
}

export { ValidationError, InternalApiError, InvalidRequestContextError, formatHttpError };

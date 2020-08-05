import OrgController from './v1/controllers/org-controller';
import StatusController from './v1/controllers/status-controller';
import { InternalApiError, formatHttpError } from '../lib/errors';

const express = require('express');

const API = {
  Org: OrgController,
};

class RouteManager {
  constructor(app) {
    this.app = app;
  }

  configureRoutes() {
    const { app } = this;
    app.get('/health', StatusController.pingResponse);
    app.post('/api/v1/organization/new', API.Org.create);
    app.post('/api/v1/organization/search', API.Org.search);
    app.get('*', (req, res) => {
      const notFoundError = new InternalApiError('Requested route not found');
      res.status(404).send(formatHttpError(notFoundError, req, res));
    });
  }
}

export default RouteManager;

import Sequelize from 'sequelize';
import { formatHttpError, InternalApiError } from '../../../lib/errors';
import Organization from '../../../lib/models/organization';
import { sessionExpiryInMilliseconds } from '../../../config/session';

class OrgController {
  static async create(req, res) {
    try {
      const newOrg = await new Organization.create(req.body);

      res.status(201).json({ organization: newOrg });
    } catch (error) {
      console.log('error:: ', error);
      res
        .status(500)
        .send(formatHttpError(new InternalApiError('Error creating new org'), req, res));
    }
  }

  static async search(req, res) {
    const criteria = req.body;
    try {
      const key = JSON.stringify(criteria);
      const savedResults = await sessionCache.get(key);

      if (savedResults) {
        res.status(200).json(savedResults);
      } else {
        const foundOrg = await new Organization.findBySearchCriteria(criteria);
        const data = { organization: foundOrg, requestId: req.orgTrackerRequestId };

        // cache the response for future requests
        await sessionCache.set({
          key,
          data,
          ex: sessionExpiryInMilliseconds,
        });
        res.status(200).json(data);
      }
    } catch (error) {
      console.log('error:: ', error);
      res
        .status(500)
        .send(
          formatHttpError(
            new InternalApiError(`Error searching for org by criteria: ${criteria}`),
            req,
            res,
          ),
        );
    }
  }
}

export default OrgController;

// Simple health check.
class StatusController {
  static async pingResponse(req, res, next) {
    const obj = {
      status: 'ok',
      envname: process.env.ENVIRONMENT_NAME,
      region: process.env.REGION_NAME,
    };

    res.status(200).json(obj);
  }
}

export default StatusController;

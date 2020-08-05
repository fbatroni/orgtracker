import Sequelize from 'sequelize';
import { connectionString } from '../config/postgres';

let singletonInstance = null;

class DBManager {
  constructor(sequelize) {
    this.sequelize = sequelize;
  }

  getSequelizeClient() {
    return this.sequelize;
  }

  static getInstance() {
    // Check if the instance exists or is null
    if (!singletonInstance) {
      const sequelize = new Sequelize(connectionString, {
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'test' ? false : true,
      });
      const dbManager = new DBManager(sequelize);

      // If null, set singletonInstance to this instance
      singletonInstance = dbManager;
    }
    return singletonInstance;
  }
}

export default DBManager;

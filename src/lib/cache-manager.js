import { connectionString } from '../config/redis';

const Redis = require('ioredis');
let singletonInstance = null;

class CacheManager {
  constructor(cacheClient) {
    this.cacheClient = cacheClient;
    this.cacheClient.on('error', (err) => console.log('caching error ' + err));
  }

  async set(options) {
    const { cacheClient } = this;
    const { key, data, ex, noExpiry } = options;

    if (!key) throw new Error('Key must be provided in set method');
    if (!data) throw new Error('Data payload not provided in set method');

    const setMethod = noExpiry
      ? await cacheClient.set(key, JSON.stringify(data))
      : await cacheClient.set(key, JSON.stringify(data), 'EX', parseInt(ex));

    return setMethod;
  }

  async get(key) {
    const { cacheClient } = this;
    if (!key) throw new Error('Key must be provided in get method');

    const cachedData = await cacheClient.get(key);

    return JSON.parse(cachedData);
  }

  async remove(key) {
    const { cacheClient } = this;
    if (!key) throw new Error('Key must be provided in remove method');

    await cacheClient.del(key);
  }

  getClient() {
    return this.cacheClient;
  }

  static getInstance() {
    // Check if the instance exists or is null
    if (!singletonInstance) {
      const cacheClient = new Redis(connectionString);
      const cacheManager = new CacheManager(cacheClient);

      // If null, set singletonInstance to this instance
      singletonInstance = cacheManager;
    }
    return singletonInstance;
  }

  async disconnect() {
    this.cacheClient.disconnect();
  }
}

export default CacheManager;

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const redis = require('../utils/redis')

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  await redis.cmd('FLUSHALL')
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  await redis.quit()
});

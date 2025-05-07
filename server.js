// server.js
const app = require('./app');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const kafkaConsumer = require('./kafka');

mongoose.connect(`${process.env.MONGO_URI.split('?')[0]}?authSource=admin`).then(() => logger.info('MongoDB connected'))
  .catch(err => logger.error('MongoDB connection error', { error: err.message }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT}`);
  await kafkaConsumer.start();
});
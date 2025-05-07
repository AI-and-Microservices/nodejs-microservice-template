const { Kafka, Partitioners } = require('kafkajs');
const logger = require('../utils/logger');

class KafkaService {
  static instance;

  constructor() {
    if (KafkaService.instance) {
      return KafkaService.instance;
    }
    console.log(process.env.KAFKA_BROKERS.split(','))
    this.kafka = new Kafka({ 
      clientId: `${process.env.SERVICE_NAME}-service`,
      brokers: process.env.KAFKA_BROKERS.split(',')
    });
    this.producer = this.kafka.producer({createPartitioner: Partitioners.DefaultPartitioner});
    this.consumers = new Map(); // Map for topic => consumer
    this.groupId = `${process.env.SERVICE_NAME}-service-group`

    KafkaService.instance = this;
  }

  async ensureTopicExists(topic) {
    const admin = this.kafka.admin();
    await admin.connect();
  
    const existingTopics = await admin.listTopics();
  
    if (!existingTopics.includes(topic)) {
      await admin.createTopics({
        topics: [{ topic, numPartitions: 1, replicationFactor: 1 }],
      });
      logger.info(`[Kafka] Created topic ${topic}`);
    }
  
    await admin.disconnect();
  }

  async sendMessage(topic, message, key='') {
    try {
      await this.producer.connect();
      await this.producer.send({
        topic,
        messages: [{key, value: JSON.stringify(message)}],
      });

      await this.producer.disconnect()
      logger.info(`Kafka message sent to ${topic}`);
    }
    catch (err) {
      logger.error(`[Kafka] Error sending message: ${err}`);
    }
  }

  async consume(topic, messageHandler) {
    await this.ensureTopicExists(topic)
    if (this.consumers.has(topic)) {
      logger.info(`[Kafka] Consumer already exists for topic ${topic}`);
      return;
    }

    const consumer = this.kafka.consumer({ groupId: this.groupId });
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const parsedValue = message.value.toString();
          await messageHandler(parsedValue, {
            topic,
            partition,
            offset: message.offset,
            key: message.key?.toString(),
          });
        } catch (err) {
          logger.error(`[Kafka] Error processing message: ${err}`);
        }
      },
    });

    this.consumers.set(topic, consumer);
    logger.info(`[Kafka] Consumer started for topic ${topic}`);
  }

  async disconnect() {
    await this.producer.disconnect();
    for (const consumer of this.consumers.values()) {
      await consumer.disconnect();
    }
    logger.info('[Kafka] Disconnected all clients');
  }
}

module.exports = new KafkaService();


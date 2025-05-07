const kafkaService = require('./services/kafkaService');

const start = async() => {
    // await kafkaService.consume('EXAMPLE_TOPIC', async (message) => {
    //     console.log(message)
    // });
}

module.exports = {start}
const origin = require('redis')
const logger = require('./logger')

class Redis {
    static instance;

    constructor() {
        if (Redis.instance) {
            return Redis.instance
        }
        this.client = origin.createClient({ url: process.env.REDIS_URI })
        this.client.connect()
        this.client.on('connect', () => {
            logger.info(`redis: 🍉 Connected - ${process.env.REDIS_URI}`)
        })
        Redis.instance = this
    }

    async quit() {
        await this.client.quit()
    }

    async cmd(...arg) {
        return this.client.sendCommand(arg)
    }


    async expire (key, time) {
        return  this.client.EXPIRE(key, time)
    }

    async get(key) {
        return JSON.parse(await  this.client.GET(key))
    }

    async set (key, value, option) {
        return  this.client.SET(key, JSON.stringify(value), option)
    }

    async hset (key, name, value) {
        return  this.client.HSET(key, name, JSON.stringify(value))
    }

    async hget (key, name) {
        return JSON.parse(await  this.client.HGET(key, name))
    }

    async hgetall (key) {
        const reply = await  this.client.HGETALL(key)

        Object.keys(reply).forEach((k) => {
            reply[k] = JSON.parse(reply[k])
        })

        return reply
    }

    async hdel (key, name) {
        return  this.client.HDEL(key, name)
    }

    async del (key) {
        return  this.client.DEL(key)
    }

    async sub (channel, callback) {
        const subscriber =  this.client.duplicate()
        await subscriber.connect()

        await subscriber.pSubscribe(channel, (message, ...arg) => {
            callback(JSON.parse(message), ...arg)
        })
        }

        async pub (channel, message) {
        return  this.client.publish(channel, JSON.stringify(message))
    }
}

module.exports = new Redis()

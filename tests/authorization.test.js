require('dotenv').config();
const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../app');
const redis = require('../utils/redis')

const validToken = jwt.sign({ 
    _id: "68125e1ea1527e85a69a5682",
    name: "user name",
    email: "vkphambn@gmail.com",
    password: "",
    googleId: "googleId",
    avatar: "",
    isActive: true,
    roles: ['user']
}, process.env.JWT_SECRET);

describe('POST /app/apps', () => {
    it('✅ Create app with valid token', async () => {
        const res = await request(app)
            .post('/app/apps')
            .set('Authorization', `Bearer ${validToken}`)
            .send({ name: 'Secure App', description: 'With JWT', type: 'chatbot' });

        expect(res.statusCode).toBe(201);
    });

    it('❌ reject when have no token', async () => {
        const res = await request(app)
            .post('/app/apps')
            .send({ name: 'No Token App' });

        expect(res.statusCode).toBe(401);
    });

    it('❌ reject when token is not valid', async () => {
        const res = await request(app)
            .post('/app/apps')
            .set('Authorization', `Bearer wrongtoken`)
            .send({ name: 'Invalid Token App' });

        expect(res.statusCode).toBe(403);
        expect(res.body.message).toEqual('Invalid token');
    });
});

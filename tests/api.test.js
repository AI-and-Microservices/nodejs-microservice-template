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
    it('✅ Create app', async () => {
        const res = await request(app)
            .post('/app/apps')
            .set('Authorization', `Bearer ${validToken}`)
            .send({ name: 'Secure App', description: 'With JWT', type: 'chatbot' });

        expect(res.statusCode).toBe(201);
        expect(res.body.data.name).toBe('Secure App');
        expect(res.body.data).toHaveProperty('_id');
    });

});

describe('GET /app/apps', () => {
    it('✅ get apps', async () => {
        const res = await request(app)
            .get('/app/apps')
            .set('Authorization', `Bearer ${validToken}`)
            .send();

        expect(res.statusCode).toBe(200);
        expect(typeof res.body.data).toBe('object');
    });

});

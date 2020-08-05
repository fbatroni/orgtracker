require('dotenv').config();

const request = require('supertest');
const app = require('../src/index.js');
describe('User API', () => {
  // it('should create a new organization', async () => {
  //   const res = await request(app)
  //     .post('/api/v1/organization/new')
  //     .send({
  //       orgname: 'Test org103',
  //       startDate: new Date(),
  //       numberOfEmployees: 5,
  //       isPublic: true,
  //     })
  //   expect(res.statusCode).toEqual(201);
  // }),
  it('should find an org based on orgname criteria', async () => {
    const res = await request(app).post('/api/v1/organization/search').send({
      orgname: 'Test org103',
    });
    expect(res.statusCode).toEqual(200);
  });
});

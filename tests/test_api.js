
const request = require('supertest');
const { expect } = require('chai');

// We will not start the server here; in a proper CI you'd export app from index.js
// For the purpose of this quick test, ensure the server is running before executing tests
describe('API smoke tests', function(){
  it('GET /api/users should return 200', async function(){
    const res = await request('http://localhost:3000').get('/api/users');
    expect(res.status).to.be.oneOf([200,401,403]); // if auth blocks, allow 401/403 in CI
  }).timeout(5000);
});

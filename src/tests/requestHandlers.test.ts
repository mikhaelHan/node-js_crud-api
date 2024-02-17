import request from 'supertest';
import server from '../server';

describe('Server', () => {
  it('GET /api/users - success', async () => {
    const res = await request(server).get('/api/users');
    expect(res.statusCode).toEqual(200);
  });

  it('GET /api/users/:id - success', async () => {
    const res = await request(server).get(
      '/api/users/9baf251b-073f-4726-b08c-b588870c2f88'
    );
    expect(res.statusCode).toEqual(200);
  });

  it('POST /api/users - success', async () => {
    const res = await request(server)
      .post('/api/users')
      .send({ name: 'Test', age: 20, hobbies: ['hello'] });
    expect(res.statusCode).toEqual(201);
  });

  it('PUT /api/users/:id - success', async () => {
    const res = await request(server)
      .put('/api/users/9baf251b-073f-4726-b08c-b588870c2f88')
      .send({ name: 'Test Updated', age: 19 });
    expect(res.statusCode).toEqual(200);
  });

  it('DELETE /api/users/:id - success', async () => {
    const res = await request(server).delete(
      '/api/users/9baf251b-073f-4726-b08c-b588870c2f88'
    );
    expect(res.statusCode).toEqual(204);
  });

  it('GET /api/unknown - failure', async () => {
    const res = await request(server).get('/api/unknown');
    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual({ error: 'Not Found !' });
  });
});

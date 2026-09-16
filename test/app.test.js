const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/app');
const { reset } = require('../src/data');

beforeEach(() => reset());

test('GET / devuelve mensaje de bienvenida', async () => {
  const res = await request(app).get('/');
  assert.equal(res.status, 200);
  assert.ok(res.body.message);
});

test('GET /health devuelve estado ok', async () => {
  const res = await request(app).get('/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'ok');
  assert.ok(res.body.uptime >= 0);
});

test('GET /users devuelve lista con paginación', async () => {
  const res = await request(app).get('/users?page=1&limit=2');
  assert.equal(res.status, 200);
  assert.equal(res.body.data.length, 2);
  assert.equal(res.body.pagination.total, 3);
  assert.equal(res.body.pagination.totalPages, 2);
});

test('GET /users filtra resultados con q', async () => {
  const res = await request(app).get('/users?q=ana');
  assert.equal(res.status, 200);
  assert.equal(res.body.data.length, 1);
  assert.equal(res.body.data[0].name, 'Ana');
});

test('GET /users/:id devuelve usuario existente', async () => {
  const res = await request(app).get('/users/2');
  assert.equal(res.status, 200);
  assert.equal(res.body.name, 'Luis');
});

test('GET /users/:id con id inexistente devuelve 404', async () => {
  const res = await request(app).get('/users/999');
  assert.equal(res.status, 404);
  assert.ok(res.body.error);
});

test('GET /users/:id con id no numérico devuelve 404', async () => {
  const res = await request(app).get('/users/abc');
  assert.equal(res.status, 404);
});

test('GET /users/stats devuelve estadísticas', async () => {
  const res = await request(app).get('/users/stats');
  assert.equal(res.status, 200);
  assert.equal(res.body.total, 3);
  assert.ok(Array.isArray(res.body.emailDomains));
});

test('POST /users crea un usuario', async () => {
  const res = await request(app)
    .post('/users')
    .send({ name: 'Nuevo', email: 'nuevo@mail.com' });
  assert.equal(res.status, 201);
  assert.equal(res.body.name, 'Nuevo');
  assert.ok(res.body.id);
});

test('POST /users sin email devuelve 400', async () => {
  const res = await request(app).post('/users').send({ name: 'Solo nombre' });
  assert.equal(res.status, 400);
});

test('POST /users con email inválido devuelve 400', async () => {
  const res = await request(app).post('/users').send({ name: 'X', email: 'no-es-email' });
  assert.equal(res.status, 400);
});

test('PUT /users/:id actualiza el usuario', async () => {
  const res = await request(app).put('/users/1').send({ name: 'Ana María' });
  assert.equal(res.status, 200);
  assert.equal(res.body.name, 'Ana María');
  assert.equal(res.body.email, 'ana@mail.com');
});

test('PUT /users/:id con id inexistente devuelve 404', async () => {
  const res = await request(app).put('/users/999').send({ name: 'X' });
  assert.equal(res.status, 404);
});

test('DELETE /users/:id elimina el usuario', async () => {
  const res = await request(app).delete('/users/1');
  assert.equal(res.status, 200);
  assert.equal(res.body.user.id, 1);
  const after = await request(app).get('/users/1');
  assert.equal(after.status, 404);
});

test('Ruta desconocida devuelve 404', async () => {
  const res = await request(app).get('/no-existe');
  assert.equal(res.status, 404);
});
import http from 'http';
import { request } from 'undici';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createServer } from './server';

let server = http.Server;
const PORT = 3000;

beforeAll(() => {
  server = createServer();
  server.listen(PORT);
});

afterAll(() => {
  server.close();
});

describe('GET /', () => {
  it('should respond status 200 OK', async () => {
    const response = await request(`http://localhost:${PORT}/`);

    expect(response.statusCode).toBe(200);
  });
});

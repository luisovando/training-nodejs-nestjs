import http from 'http';
import { request } from 'undici';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createServer } from './server';

let server = http.createServer();
const PORT = 3000;

beforeAll(() => {
  server = createServer();
  server.listen(PORT);
});

afterAll(() => {
  server.close();
});

describe('GET /file', () => {
  it('should return 404 if file does not exist', async () => {
    if (!PORT) throw new Error('PORT not initialized');

    const response = await request(`http://localhost:${PORT}/file`);
    const body = await response.body.json();

    expect(response.statusCode).toBe(404);
    expect(body).toEqual({
      error: 'File not found',
    });
  });
});

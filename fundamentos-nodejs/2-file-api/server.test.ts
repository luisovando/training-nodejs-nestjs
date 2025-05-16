import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import http from 'http';
import { resolve } from 'path';
import { request } from 'undici';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createServer } from './server';

const filePath = resolve(process.cwd(), 'fundamentos-nodejs/2-file-api/data.json');
const PORT = 3000;
let server = http.createServer();

beforeAll(() => {
  server = createServer();
  server.listen(PORT);
});

afterAll(() => {
  if (existsSync(filePath)) unlinkSync(filePath);
  server.close();
});

describe('GET /file', () => {
  describe('when file does NOT exist', () => {
    beforeEach(() => {
      if (existsSync(filePath)) unlinkSync(filePath);
    });

    it('should return 404 with error message', async () => {
      const response = await request(`http://localhost:${PORT}/file`);
      const body = await response.body.json();

      expect(response.statusCode).toBe(404);
      expect(body).toEqual({ error: 'File not found' });
    });
  });

  describe('when file DOES exist', () => {
    beforeEach(() => {
      writeFileSync(filePath, JSON.stringify({ hero: 'Batman' }));
    });

    it('should return 200 with file content', async () => {
      const response = await request(`http://localhost:${PORT}/file`);
      const body = await response.body.json();

      expect(response.statusCode).toBe(200);
      expect(body).toEqual(expect.objectContaining({ hero: 'Batman' }));
    });
  });
});

describe('POST /file', () => {
  describe('when a valid content is send', () => {
    it('should save into the file and return 201 with message', async () => {
      const requestBody = { hero: 'Batman' };
      const { statusCode, body } = await request(`http://localhost:${PORT}/file`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const decodedJson = await body.json();
      const content = JSON.parse(readFileSync(filePath, 'utf-8'));

      expect(statusCode).toBe(201);
      expect(decodedJson).toEqual(
        expect.objectContaining({
          success: true,
        })
      );
      expect(content).toEqual(requestBody);
    });
  });
});

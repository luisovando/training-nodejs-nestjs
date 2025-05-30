import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import http from 'http';
import { resolve } from 'path';
import { request } from 'undici';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, test } from 'vitest';
import { createServer } from './server';

const filePath = resolve(process.cwd(), 'fundamentos-nodejs/2-file-api/data.json');
const PORT = 3000;
const invalidJsonBodies = [['null'], ['[]'], ['42'], ['"hello"'], ['true']];

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

  describe('when payload is not valid JSON', () => {
    it('should response with 400 and error message', async () => {
      const { statusCode, body } = await request(`http://localhost:${PORT}/file`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: 'not a json',
      });

      const json = await body.json();

      expect(statusCode).toBe(400);
      expect(json).toEqual({ error: 'Invalid JSON payload' });
    });
  });

  describe('when JSON is valid but not an object', () => {
    test.each(invalidJsonBodies)('should return 400 for body: %s', async (bodyValue) => {
      const { statusCode, body } = await request(`http://localhost:${PORT}/file`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: bodyValue,
      });

      const json = await body.json();

      expect(statusCode).toBe(400);
      expect(json).toEqual({ error: 'Invalid JSON payload' });
    });
  });
});

describe('GET /external', () => {
  describe('when the external API response with content', () => {
    beforeEach(() => {
      if (existsSync(filePath)) unlinkSync(filePath);
      global.fetch = fetch;
    });

    it('should proxy the external API and respond 200 with its data', async () => {
      const { statusCode, body } = await request(`http://localhost:${PORT}/external`);
      const json = await body.json();

      expect(statusCode).toBe(200);
      expect(json).toEqual(
        expect.objectContaining({
          userId: 1,
        })
      );
    });

    it('should save the external content in data.json file', async () => {
      await request(`http://localhost:${PORT}/external`);

      expect(existsSync(filePath)).toBe(true);

      const content = JSON.parse(readFileSync(filePath, 'utf-8'));
      expect(content).toHaveProperty('userId', 1);
    });
  });

  describe('when external API fail', () => {
    const originalFetch = global.fetch;

    beforeAll(() => {
      if (existsSync(filePath)) unlinkSync(filePath);
      global.fetch = () => Promise.reject(new Error('external down')) as any;
    });

    afterAll(() => {
      if (existsSync(filePath)) unlinkSync(filePath);
      global.fetch = originalFetch;
    });

    it('should respond with 502 and error message', async () => {
      const { statusCode, body } = await request(`http://localhost:${PORT}/external`);
      const json = await body.json();

      expect(statusCode).toBe(502);
      expect(json).toEqual({ error: 'External service unavailable' });
    });
  });
});

describe('GET /external - with cached content', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    const cachedData = JSON.stringify({ cached: true });
    writeFileSync(filePath, cachedData, 'utf-8');
    global.fetch = () => {
      throw new Error('fetch should NOT be called.');
    };
  });

  afterEach(() => {
    global.fetch = originalFetch;
    if (existsSync(filePath)) unlinkSync(filePath);
  });

  it('should serve data from cache and not call external API', async () => {
    const { statusCode, body } = await request(`http://localhost:${PORT}/external`);
    const json = await body.json();

    expect(statusCode).toBe(200);
    expect(json).toEqual({ cached: true });
  });
});

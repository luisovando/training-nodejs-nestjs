import { writeFile } from 'fs/promises';
import { ServerResponse } from 'http';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

export async function handleFileWrite(res: ServerResponse, body: string) {
  try {
    const parsedBody = JSON.parse(body);

    if (typeof parsedBody !== 'object' || parsedBody === null || Array.isArray(parsedBody)) {
      return res
        .setHeader('Content-Type', 'application/json')
        .writeHead(400)
        .end(JSON.stringify({ error: 'Invalid JSON payload' }));
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const filePath = resolve(__dirname, '../data.json');

    await writeFile(filePath, JSON.stringify(parsedBody), 'utf-8');

    res
      .setHeader('Content-Type', 'application/json')
      .writeHead(201)
      .end(JSON.stringify({ success: true }));
  } catch (e) {
    console.error('Error: ', e);
    return res
      .setHeader('Content-Type', 'application/json')
      .writeHead(400)
      .end(JSON.stringify({ error: 'Invalid JSON payload' }));
  }
}

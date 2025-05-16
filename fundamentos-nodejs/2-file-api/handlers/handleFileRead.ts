import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { ServerResponse } from 'http';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

export async function handleFileRead(res: ServerResponse) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const filePath = resolve(__dirname, '../data.json');
  const fileExist = existsSync(filePath);

  if (!fileExist) {
    return res
      .setHeader('Content-Type', 'application/json')
      .writeHead(404)
      .end(JSON.stringify({ error: 'File not found' }));
  }

  const content = await readFile(filePath, 'utf-8');
  res.setHeader('Content-Type', 'application/json').writeHead(200).end(content);
}

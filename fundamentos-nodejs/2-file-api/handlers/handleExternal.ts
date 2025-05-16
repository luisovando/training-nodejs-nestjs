import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { ServerResponse } from 'http';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

export async function handleExternal(res: ServerResponse) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const filePath = resolve(__dirname, '../data.json');
  const fileExist = existsSync(filePath);
  console.log('[external] serving from', fileExist ? 'cache' : 'API');

  try {
    let content = '';

    if (fileExist) {
      const raw = await readFile(filePath, 'utf-8');
      content = JSON.parse(raw);
    } else {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
      content = await response.json();

      await writeFile(filePath, JSON.stringify(content), 'utf-8');
    }

    res.setHeader('Content-Type', 'application/json').writeHead(200).end(JSON.stringify(content));
  } catch (err) {
    console.error('External error: ', err);
    res
      .setHeader('Content-Type', 'application/json')
      .writeHead(502)
      .end(JSON.stringify({ error: 'External service unavailable' }));
  }
}

import { writeFile } from 'fs/promises';
import { ServerResponse } from 'http';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

export async function handleExternal(res: ServerResponse) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const filePath = resolve(__dirname, '../data.json');

  const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
  const data = await response.json();
  const content = JSON.stringify(data);

  await writeFile(filePath, content, 'utf-8');

  res.setHeader('Content-Type', 'application/json').writeHead(200).end(content);
}

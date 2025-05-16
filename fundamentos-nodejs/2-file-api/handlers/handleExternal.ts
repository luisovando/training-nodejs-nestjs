import { ServerResponse } from 'http';

export async function handleExternal(res: ServerResponse) {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
  const data = await response.json();

  res.setHeader('Content-Type', 'application/json').writeHead(200).end(JSON.stringify(data));
}

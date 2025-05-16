import { ServerResponse } from 'http';

export function handleFileRead(res: ServerResponse) {
  return res.writeHead(404).end(JSON.stringify({ error: 'File not found' }));
}

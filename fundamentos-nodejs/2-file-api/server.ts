import http, { IncomingMessage, ServerResponse } from 'http';
import { handleExternal } from './handlers/handleExternal';
import { handleFileRead } from './handlers/handleFileRead';
import { handleFileWrite } from './handlers/handleFileWrite';

export function createServer() {
  return http.createServer((req: IncomingMessage, res: ServerResponse) => {
    if (req.method === 'GET' && req.url === '/file') {
      return handleFileRead(res);
    }

    if (req.method === 'POST' && req.url === '/file') {
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', () => {
        handleFileWrite(res, body);
      });
      return;
    }

    if (req.method === 'GET' && req.url === '/external') {
      return handleExternal(res);
    }

    return res
      .setHeader('Content-Type', 'application/json')
      .writeHead(404)
      .end(JSON.stringify({ status: 404, message: 'Not Found' }));
  });
}

if (process.env.NODE_ENV !== 'test') {
  const PORT = 3000;
  const server = createServer();

  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

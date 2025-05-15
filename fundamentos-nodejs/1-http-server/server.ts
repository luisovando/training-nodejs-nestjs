// Import http module
import http, { IncomingMessage, ServerResponse } from 'http';

const PORT = 3000;

// Call to createServer method and pass a callback to manage req and res
const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  if (req.method === 'GET' && req.url === '/') {
    return res
      .setHeader('Content-Type', 'application/json')
      .writeHead(200)
      .end(JSON.stringify({ message: 'Hello from Node.js server' }));
  } else {
    return res
      .setHeader('Content-Type', 'application/json')
      .writeHead(404)
      .end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

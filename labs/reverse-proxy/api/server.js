'use strict';

const http = require('node:http');

const send = (res, status, payload) => {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body),
    'cache-control': 'no-store',
  });
  res.end(body);
};

const server = http.createServer((req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) {
    return send(res, 405, { error: 'method_not_allowed' });
  }

  if (req.url === '/health') {
    return send(res, 200, { status: 'ok', service: 'study-api' });
  }

  if (req.url === '/request-info') {
    return send(res, 200, {
      method: req.method,
      path: req.url,
      requestId: req.headers['x-request-id'] || null,
      forwardedFor: req.headers['x-forwarded-for'] || null,
      forwardedProto: req.headers['x-forwarded-proto'] || null,
    });
  }

  return send(res, 404, { error: 'not_found' });
});

server.requestTimeout = 10_000;
server.headersTimeout = 8_000;
server.keepAliveTimeout = 5_000;
server.maxRequestsPerSocket = 100;

server.listen(3000, '0.0.0.0', () => {
  console.log(JSON.stringify({ level: 'info', event: 'server_started', port: 3000 }));
});

const shutdown = () => server.close(() => process.exit(0));
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

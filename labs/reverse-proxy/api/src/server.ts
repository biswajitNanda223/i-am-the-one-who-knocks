import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';

type JsonValue = string | number | boolean | null;
type JsonObject = Record<string, JsonValue>;

const allowedMethods = new Set(['GET', 'HEAD']);

function sendJson(res: ServerResponse, status: number, payload: JsonObject): void {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body),
    'cache-control': 'no-store',
  });
  res.end(body);
}

function firstHeader(req: IncomingMessage, name: string): string | null {
  const value = req.headers[name];
  return Array.isArray(value) ? (value[0] ?? null) : (value ?? null);
}

function handleRequest(req: IncomingMessage, res: ServerResponse): void {
  const method = req.method ?? 'UNKNOWN';
  const path = req.url ?? '/';

  if (!allowedMethods.has(method)) {
    sendJson(res, 405, { error: 'method_not_allowed' });
    return;
  }

  if (path === '/health') {
    sendJson(res, 200, { status: 'ok', service: 'study-api' });
    return;
  }

  if (path === '/request-info') {
    sendJson(res, 200, {
      method,
      path,
      requestId: firstHeader(req, 'x-request-id'),
      forwardedFor: firstHeader(req, 'x-forwarded-for'),
      forwardedProto: firstHeader(req, 'x-forwarded-proto'),
    });
    return;
  }

  sendJson(res, 404, { error: 'not_found' });
}

const server = createServer(handleRequest);
server.requestTimeout = 10_000;
server.headersTimeout = 8_000;
server.keepAliveTimeout = 5_000;
server.maxRequestsPerSocket = 100;

server.listen(3000, '0.0.0.0', () => {
  console.log(JSON.stringify({ level: 'info', event: 'server_started', port: 3000 }));
});

function shutdown(): void {
  server.close(() => process.exit(0));
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

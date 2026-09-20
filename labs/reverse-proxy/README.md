# Reverse-proxy networking lab

This localhost-only lab demonstrates client → edge → TypeScript API traffic, container DNS, proxy headers, request IDs, health checks, and basic runtime hardening. The API is compiled with strict TypeScript settings in a multi-stage container build.

## API development

```bash
cd labs/reverse-proxy/api
npm ci
npm run check
npm run build
npm start
```

Generated `dist/` files and dependencies are intentionally excluded from Git.

## Start

```bash
docker compose -f labs/reverse-proxy/compose.yaml up --build -d
docker compose -f labs/reverse-proxy/compose.yaml ps
```

## Verify

```bash
curl -i http://127.0.0.1:8080/health
curl -i -H "X-Request-ID: study-001" http://127.0.0.1:8080/api/request-info
curl -i -X TRACE http://127.0.0.1:8080/
docker compose -f labs/reverse-proxy/compose.yaml logs --no-color
```

Observe that only the edge has a host port, the API resolves by service name, proxy metadata reaches the API, and responses include a request ID and browser security headers.

## Experiments

1. Stop only the API and observe proxy status/logs.
2. Rebuild and confirm health checks recover.
3. Compare a client-supplied request ID with a generated one.
4. Inspect the Docker network and explain each address and route.
5. Add an automated negative test for an unsupported method.

## Stop

```bash
docker compose -f labs/reverse-proxy/compose.yaml down --remove-orphans
```

Do not expose this educational lab to an untrusted network. It provides no user authentication and uses cleartext HTTP inside the local environment.

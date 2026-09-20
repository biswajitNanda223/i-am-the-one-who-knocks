# Application-security test plan

Only test systems you own or have written authorization to assess.

## Test pyramid

| Level | Focus | Examples |
|---|---|---|
| Unit | security decisions in isolation | validators, authorization policy, encoders |
| Integration | boundaries and dependencies | token validation, database queries, proxy headers |
| System | deployed behavior | authentication flows, rate limits, browser headers |
| Resilience | controlled failures | timeout, dependency outage, queue saturation |
| Manual | logic and chained abuse | object ownership, workflow bypass, privilege boundaries |

## Core cases

- Authentication: missing, malformed, expired, wrong issuer/audience, revoked session.
- Authorization: cross-tenant/object access, role escalation, bulk endpoints, indirect references.
- Input: type, length, encoding, duplicate keys, unexpected fields, content type.
- Output: injection-safe encoding, error minimization, no secret/PII leakage.
- Session: secure cookie attributes, rotation, logout invalidation, CSRF where applicable.
- Network: trusted proxy configuration, host/header validation, request smuggling defenses.
- Business logic: replay, race conditions, limit bypass, invalid state transitions.
- Operations: alert generated, correlation ID retained, audit event sufficient for reconstruction.

## Lab checks

After starting the reverse-proxy lab:

```bash
curl -i http://127.0.0.1:8080/health
curl -i http://127.0.0.1:8080/api/request-info
curl -i -X TRACE http://127.0.0.1:8080/
curl -i http://127.0.0.1:8080/not-found
```

Expected: `200`, `200`, `405`, and `404`. Confirm security headers and a request ID on responses. The lab is not intentionally vulnerable; extend it with tests, not exploitable behavior.

## Finding template

- Title and affected asset/version
- Preconditions and authorization context
- Minimal reproducible steps (sanitized)
- Observed vs expected result
- Business/technical impact
- Evidence and relevant logs
- Recommended root-cause fix
- Severity rationale and owner
- Retest result and date

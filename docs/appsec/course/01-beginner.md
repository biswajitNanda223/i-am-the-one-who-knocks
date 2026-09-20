# Beginner: secure coding foundations

## 1. Assets, threats, vulnerabilities, and risk

- **Asset:** something valuable, such as credentials, customer records, money, availability, or reputation.
- **Threat:** something capable of causing harm, such as credential theft or an abusive authenticated user.
- **Vulnerability:** a weakness that makes harm possible.
- **Control:** a safeguard that prevents, detects, or helps recover from harm.
- **Risk:** the likelihood and business impact of a threat exploiting a vulnerability.

**Plain example:** Customer data is the asset. An attacker is the threat. Missing object authorization is the vulnerability. A server-side ownership check is a preventive control. An alert on mass exports is a detective control.

## 2. Never trust client input

Browser fields, headers, cookies, URLs, uploaded files, queue messages, and third-party API responses are all untrusted at the boundary.

### Unsafe: checking only that a value exists

```ts
function setDisplayName(input: unknown) {
  if (!input) throw new Error('required');
  return String(input);
}
```

This accepts objects, huge strings, control characters, and values outside the business rules.

### Safer: parse to a narrow contract

```ts
function parseDisplayName(input: unknown): string {
  if (typeof input !== 'string') throw new Error('invalid_type');

  const value = input.normalize('NFC').trim();
  if (value.length < 1 || value.length > 80) throw new Error('invalid_length');
  if (!/^[\p{L}\p{M} .'-]+$/u.test(value)) throw new Error('invalid_characters');
  return value;
}
```

Validation should match the business contract. Do not use one regex as a universal defense, and do not silently repair ambiguous security-sensitive values.

## 3. Injection: keep data separate from instructions

### Unsafe SQL construction

```ts
const sql = `SELECT id, email FROM users WHERE email = '${email}'`;
await database.query(sql);
```

The input becomes part of the SQL grammar.

### Safe parameterization

```ts
const result = await database.query(
  'SELECT id, email FROM users WHERE email = $1',
  [email],
);
```

The database receives the query structure and data separately. Apply the same principle to OS commands, LDAP, templates, and other interpreters. An allow-list is still needed where parameters cannot represent identifiers such as sort-column names.

## 4. Output encoding and cross-site scripting

Encoding depends on context: HTML text, HTML attribute, JavaScript, CSS, and URL contexts differ. Prefer frameworks that escape text by default.

```ts
// Safer DOM API: content is text, not markup.
element.textContent = userSuppliedMessage;

// Dangerous when input is untrusted.
element.innerHTML = userSuppliedMessage;
```

A Content Security Policy adds defense in depth but does not make unsafe HTML construction acceptable.

## 5. Passwords and secrets

- Passwords are hashed with a password-specific, salted, adaptive algorithm; they are not encrypted for later recovery.
- API keys, database passwords, signing keys, and tokens stay out of source control and logs.
- Secrets should be narrowly scoped, rotated, and preferably short-lived.

```ts
// Never do this.
const apiKey = 'production-secret-value';

// Better: inject it at runtime and fail closed when absent.
const apiKey = process.env.PAYMENTS_API_KEY;
if (!apiKey) throw new Error('PAYMENTS_API_KEY is required');
```

If a secret reaches Git, rotate/revoke it. Deleting the latest line does not remove it from history or existing clones.

## 6. Safe errors and logging

Return a stable public error and keep diagnostic details in restricted logs. Never log passwords, full tokens, session cookies, or unnecessary personal data.

```ts
try {
  await placeOrder(input);
} catch (error: unknown) {
  logger.error({ event: 'order_failed', requestId, errorType: classify(error) });
  response.status(500).json({ error: 'internal_error', requestId });
}
```

The lab's `redact` helper shows a small defensive example. Production redaction should be schema-driven and tested.

## 7. HTTP baseline

- HTTPS with certificate validation protects data in transit.
- Size and time limits reduce resource exhaustion.
- `HttpOnly`, `Secure`, and suitable `SameSite` settings protect session cookies.
- Cache policy prevents sensitive responses from being stored incorrectly.
- Security headers reduce browser attack surface.
- Unknown methods/routes should fail consistently.

## Beginner exercise

Add a pure `parsePageSize(input: unknown)` function that accepts integers from 1 through 100. Test `1`, `100`, `0`, `101`, `"10"`, `NaN`, and an object. Explain why converting `"10"` automatically could hide a client integration defect.

## Beginner checklist

- Inputs have explicit types, sizes, ranges, and allowed formats.
- Interpreter calls use safe structured APIs.
- Output uses context-safe framework APIs.
- Secrets are externalized and logs are minimized/redacted.
- Errors reveal no internals to the client.
- Security behavior has positive and negative tests.

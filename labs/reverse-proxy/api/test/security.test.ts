import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { canReadResource, normalizeRequestId, redact } from '../src/security.js';

describe('normalizeRequestId', () => {
  it('accepts a bounded allow-listed identifier', () => {
    assert.equal(normalizeRequestId('request-123.test'), 'request-123.test');
  });

  it('rejects control characters and oversized values', () => {
    assert.equal(normalizeRequestId('good\nforged-log-entry'), null);
    assert.equal(normalizeRequestId('a'.repeat(65)), null);
  });
});

describe('canReadResource', () => {
  const privateRecord = { ownerId: 'alice', classification: 'private' } as const;

  it('allows the owner and an administrator', () => {
    assert.equal(canReadResource({ id: 'alice', role: 'reader' }, privateRecord), true);
    assert.equal(canReadResource({ id: 'bob', role: 'admin' }, privateRecord), true);
  });

  it('denies another ordinary user', () => {
    assert.equal(canReadResource({ id: 'bob', role: 'reader' }, privateRecord), false);
  });
});

describe('redact', () => {
  it('removes bearer tokens and sensitive query values', () => {
    const input = 'Authorization=Bearer abc.def?token=secret&safe=yes';
    const output = redact(input);
    assert.equal(output.includes('abc.def'), false);
    assert.equal(output.includes('token=secret'), false);
    assert.equal(output.includes('safe=yes'), true);
  });
});

const requestIdPattern = /^[A-Za-z0-9._-]{1,64}$/;

export type Role = 'reader' | 'admin';

export interface Resource {
  ownerId: string;
  classification: 'public' | 'private';
}

/** Accept identifiers only when they match the same contract enforced at the edge. */
export function normalizeRequestId(value: string | string[] | undefined): string | null {
  const candidate = Array.isArray(value) ? value[0] : value;
  return candidate !== undefined && requestIdPattern.test(candidate) ? candidate : null;
}

/** Object-level authorization belongs on the server, never only in the UI. */
export function canReadResource(
  actor: { id: string; role: Role },
  resource: Resource,
): boolean {
  return resource.classification === 'public'
    || actor.role === 'admin'
    || actor.id === resource.ownerId;
}

/** Keep common credential forms out of structured telemetry. */
export function redact(value: string): string {
  return value
    .replace(/Bearer\s+[A-Za-z0-9._~-]+/gi, 'Bearer [REDACTED]')
    .replace(/([?&](?:token|api_key|password)=)[^&\s]+/gi, '$1[REDACTED]');
}

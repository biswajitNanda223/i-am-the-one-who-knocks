# System architecture (HLD)

The reference architecture represents a public API delivered through an edge proxy, backed by private application and data tiers, with centralized telemetry and a controlled delivery path.

```mermaid
flowchart TB
    I["Internet client"] -->|"DNS + HTTPS"| W["WAF / rate limit"]
    W --> P["TLS reverse proxy"]
    P -->|"mTLS or private TLS"| API["Stateless API replicas"]
    API --> DB[("Primary database")]
    API --> C[("Cache")]
    API --> Q["Job queue"]
    Q --> WK["Worker"]
    WK --> DB
    P --> T["Telemetry pipeline"]
    API --> T
    WK --> T
    T --> SIEM["Dashboards / alerts / SIEM"]
    IDP["Identity provider"] -->|"OIDC/JWKS"| API
    CD["CI/CD + artifact registry"] -->|"Verified deployment"| P
    CD --> API
    CD --> WK
```

## Trust zones

```mermaid
flowchart LR
    subgraph Z0["Zone 0 — Untrusted"]
      U["Clients"]
    end
    subgraph Z1["Zone 1 — Edge"]
      E["WAF / proxy"]
    end
    subgraph Z2["Zone 2 — Application"]
      A["API / workers"]
    end
    subgraph Z3["Zone 3 — Data"]
      D["Database / secrets"]
    end
    subgraph Z4["Zone 4 — Management"]
      M["CI/CD / observability"]
    end
    U --> E --> A --> D
    M --> E
    M --> A
```

Every arrow is an allow-listed flow, not implied reachability. Default deny ingress and egress, authenticate service identity, encrypt across trust boundaries, and record policy decisions.

## Quality attributes

| Attribute | Target design response |
|---|---|
| Security | least privilege, strong identity, defense in depth, immutable artifacts |
| Availability | stateless replicas, bounded retries, health checks, graceful degradation |
| Performance | connection reuse, caching with explicit policy, asynchronous work |
| Operability | correlation IDs, structured logs, RED metrics, distributed traces |
| Recoverability | tested backups, documented RTO/RPO, reproducible infrastructure |

## Key decisions

1. Terminate public TLS at a hardened edge; use authenticated encryption for sensitive internal hops.
2. Keep APIs stateless and externalize durable state.
3. Never expose data stores directly to the public network.
4. Use short-lived workload/user identity and centralized policy where practical.
5. Deploy only scanned, signed, pinned artifacts through an auditable pipeline.

See the [low-level design](lld.md), [threat model](../appsec/threat-model.md), and [operations runbook](../operations/incident-response.md).

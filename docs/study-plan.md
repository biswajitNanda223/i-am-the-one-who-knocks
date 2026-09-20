# 12-week study plan

Budget 6–8 hours per week: 40% theory, 50% hands-on work, and 10% written reflection.

| Week | Theme | Practical evidence | Exit criteria |
|---:|---|---|---|
| 1 | OSI/TCP-IP, frames, packets | Inspect local interfaces and route table | Explain encapsulation end to end |
| 2 | IPv4/IPv6 and subnetting | Design three subnets; verify calculations | Derive network, host range, broadcast |
| 3 | Ethernet, ARP/NDP, VLANs | Capture address resolution in an isolated lab | Distinguish L2 and L3 decisions |
| 4 | Routing, NAT, firewalls | Trace routes and document stateful rules | Predict next hop and return path |
| 5 | DNS, DHCP, time | Query record types and trace resolution | Explain caching and trust failure modes |
| 6 | TCP, UDP, QUIC | Capture a handshake and retransmission | Interpret flags, ports, state, loss |
| 7 | TLS and PKI | Inspect a certificate chain | Explain identity, encryption, integrity |
| 8 | HTTP, proxies, load balancing | Run the reverse-proxy lab | Trace headers and proxy boundaries |
| 9 | Threat modeling | Complete the STRIDE worksheet | Map threats to concrete controls |
| 10 | Secure coding and API security | Add negative tests to the lab | Validate input, authn, authz, output |
| 11 | Security testing and CI/CD | Run SAST/SCA/container checks locally | Triage findings by risk and evidence |
| 12 | Observability and response | Execute the incident tabletop | Produce timeline and corrective actions |

## Weekly loop

1. Define two measurable learning objectives.
2. Read the linked notes and check primary protocol documentation where needed.
3. Run a lab in an isolated environment.
4. Draw the actual request/data flow from memory.
5. Perform one failure injection (bad DNS, closed port, expired certificate, malformed input).
6. Record evidence and update the knowledge gaps list.

## Assessment rubric

- **Recall:** names components and protocol fields.
- **Explain:** describes why each hop or control exists.
- **Apply:** builds and troubleshoots the lab without a recipe.
- **Analyze:** identifies trust boundaries, failure modes, and attack paths.
- **Defend:** chooses a proportionate control and proves it works.

Advance only when you can analyze and defend the current layer. Keep offensive testing limited to the provided local environment or an explicitly authorized target.

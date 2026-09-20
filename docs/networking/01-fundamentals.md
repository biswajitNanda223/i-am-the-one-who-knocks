# Networking fundamentals

## Two useful models

| OSI | TCP/IP | Typical examples | Unit |
|---|---|---|---|
| 7 Application | Application | HTTP, DNS, SSH | Data/message |
| 6 Presentation | Application | TLS encoding, serialization | Data |
| 5 Session | Application | Session lifecycle | Data |
| 4 Transport | Transport | TCP, UDP, QUIC | Segment/datagram |
| 3 Network | Internet | IPv4, IPv6, ICMP | Packet |
| 2 Data link | Link | Ethernet, Wi-Fi, ARP | Frame |
| 1 Physical | Link | Copper, fiber, radio | Bits |

Models are troubleshooting tools, not literal implementations. Ask at every boundary: what identifier is used, what state exists, how is integrity checked, and where can policy be enforced?

## Addressing and forwarding

- A MAC address identifies a link-layer interface on a local segment.
- An IP address identifies an interface for routed communication.
- A port identifies a transport endpoint on a host.
- DNS maps names to data such as addresses; it does not establish reachability.
- A switch forwards frames using a MAC table. A router forwards packets using longest-prefix matching.
- NAT rewrites address/port tuples; a stateful firewall tracks flows and applies policy. Neither is a substitute for application authorization.

## Subnet worked example

For `10.20.30.0/24`, splitting into four equal networks borrows two bits and produces `/26` networks:

| Network | Usable range | Broadcast |
|---|---|---|
| `10.20.30.0/26` | `.1`–`.62` | `.63` |
| `10.20.30.64/26` | `.65`–`.126` | `.127` |
| `10.20.30.128/26` | `.129`–`.190` | `.191` |
| `10.20.30.192/26` | `.193`–`.254` | `.255` |

IPv6 has no broadcast; Neighbor Discovery and multicast replace several IPv4 mechanisms. Do not apply IPv4 NAT assumptions to IPv6 security design.

## Troubleshooting ladder

Work bottom-up when the failure is broad, and top-down when one application is failing:

1. Physical/link: interface up, signal, VLAN, neighbor table.
2. Network: address, prefix, gateway, routes, ICMP evidence.
3. Transport: listening socket, firewall, handshake, retransmissions.
4. Name/security: DNS answer, certificate name/chain/time.
5. Application: status code, headers, logs, authorization, dependencies.

Useful read-only commands: `ipconfig /all`, `Get-NetRoute`, `Get-NetTCPConnection`, `nslookup`, `Resolve-DnsName`, `Test-NetConnection`; on Linux: `ip addr`, `ip route`, `ss`, `dig`, `tracepath`, and `curl -v`.

## Security lens

- Treat every network as potentially hostile.
- Authenticate workload identity; do not trust an IP address alone.
- Minimize listening services and ingress/egress paths.
- Encrypt sensitive traffic and verify peer identity.
- Log policy decisions without logging secrets.
- Segment by trust and business impact, then test the boundaries.

# Contributing

Contributions should improve technical accuracy, safety, reproducibility, or learning value.

1. Create a focused branch from the default branch.
2. Keep labs local and defensive; do not add real credentials, targets, exploit payload collections, or sensitive captures.
3. Update diagrams and threat models when a data flow or trust boundary changes.
4. Run `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/validate.ps1` and the affected lab.
5. Open a pull request describing intent, verification evidence, security impact, and documentation changes.

Use clear Markdown headings, fenced code blocks with language tags, descriptive link text, and Mermaid diagrams that render on GitHub. Prefer primary standards and vendor documentation for protocol claims.

Commit messages should be imperative and scoped, for example `docs(networking): explain TLS handshake` or `lab(proxy): add timeout test`.

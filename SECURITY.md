# Security policy

## Responsible use

This repository is for defensive education in isolated environments. Do not scan, intercept, disrupt, or attempt to access systems without explicit authorization. You are responsible for complying with applicable law, policy, and engagement scope.

## Reporting a repository vulnerability

Do not disclose an unpatched vulnerability in a public issue. Use the repository owner's private GitHub security-reporting channel when available. Include the affected path/version, impact, minimal reproduction, and suggested mitigation. Do not include real secrets or personal data.

## Secrets and evidence

Never commit passwords, tokens, private keys, production configuration, customer data, or raw captures. If a secret is committed, revoke/rotate it immediately; deleting it from the latest commit is not sufficient because Git history and clones retain it.

## Supported version

The latest commit on the default branch is the maintained educational version. Dependencies and examples must be reviewed before production use.

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$required = @(
  'README.md',
  'SECURITY.md',
  'CONTRIBUTING.md',
  'docs/study-plan.md',
  'docs/architecture/README.md',
  'docs/architecture/lld.md',
  'docs/appsec/threat-model.md',
  'docs/appsec/end-to-end-appsec.md',
  'docs/appsec/sast-dast-vapt.md',
  'docs/appsec/security-automation.md',
  'docs/appsec/cybersecurity-map.md',
  'labs/reverse-proxy/api/src/server.ts',
  'labs/reverse-proxy/compose.yaml'
)

$missing = $required | Where-Object { -not (Test-Path -LiteralPath $_) }
if ($missing) { throw "Missing required files: $($missing -join ', ')" }

$markdown = Get-ChildItem -Recurse -File -Filter '*.md'
foreach ($file in $markdown) {
  $text = Get-Content -Raw -LiteralPath $file.FullName
  $fences = ([regex]::Matches($text, '(?m)^```')).Count
  if ($fences % 2 -ne 0) { throw "Unbalanced code fence: $($file.FullName)" }
}

Push-Location labs/reverse-proxy/api
try {
  npm ci --ignore-scripts
  npm run check
  npm test
  npm run audit:prod
} finally {
  Pop-Location
}
if (Get-Command docker -ErrorAction SilentlyContinue) {
  docker compose -f labs/reverse-proxy/compose.yaml config --quiet
}

Write-Host "Validation passed: $($markdown.Count) Markdown files checked."

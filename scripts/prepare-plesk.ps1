$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$deployRoot = Join-Path $projectRoot "deploy"
$packageRoot = Join-Path $deployRoot "tenas-plesk"
$zipPath = Join-Path $deployRoot "tenas-plesk.zip"

if (-not $packageRoot.StartsWith($projectRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw "Deployment path resolved outside the project."
}

if (Test-Path -LiteralPath $packageRoot) {
  Remove-Item -LiteralPath $packageRoot -Recurse -Force
}
if (Test-Path -LiteralPath $zipPath) {
  Remove-Item -LiteralPath $zipPath -Force
}

New-Item -ItemType Directory -Path $packageRoot | Out-Null
New-Item -ItemType Directory -Path (Join-Path $packageRoot "data") | Out-Null

Copy-Item -LiteralPath (Join-Path $projectRoot "server.js") -Destination $packageRoot
Copy-Item -LiteralPath (Join-Path $projectRoot "app.cjs") -Destination $packageRoot
Copy-Item -LiteralPath (Join-Path $projectRoot "package.json") -Destination $packageRoot
Copy-Item -LiteralPath (Join-Path $projectRoot "package-lock.json") -Destination $packageRoot
Copy-Item -LiteralPath (Join-Path $projectRoot ".env.example") -Destination $packageRoot
Copy-Item -LiteralPath (Join-Path $projectRoot "DEPLOY_PLESK.md") -Destination $packageRoot
Copy-Item -LiteralPath (Join-Path $projectRoot "public") -Destination $packageRoot -Recurse
Copy-Item -LiteralPath (Join-Path $projectRoot "data\content.json") -Destination (Join-Path $packageRoot "data\content.json")

Set-Content -LiteralPath (Join-Path $packageRoot "data\members.json") -Value "[]" -Encoding ascii
Set-Content -LiteralPath (Join-Path $packageRoot "data\submissions.json") -Value "[]" -Encoding ascii

Compress-Archive -Path (Join-Path $packageRoot "*") -DestinationPath $zipPath -CompressionLevel Optimal

Write-Host "Plesk package created:"
Write-Host $zipPath
Write-Host ""
Write-Host "The package contains current public content and empty member/submission data."
Write-Host "It does not contain .env, node_modules, Git history, logs, or local account records."

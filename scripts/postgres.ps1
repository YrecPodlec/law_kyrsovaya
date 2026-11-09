param([ValidateSet('start', 'stop', 'status')][string]$Action = 'start')
$ErrorActionPreference = 'Stop'
$workspacePath = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$localPath = Join-Path $workspacePath '.local'
$binaryPath = Join-Path $localPath 'pgsql\bin'
$dataPath = Join-Path $localPath 'postgres-data'
$envPath = Join-Path $workspacePath '.env'
$pgCtlPath = Join-Path $binaryPath 'pg_ctl.exe'

if ($Action -ne 'start') {
  if (!(Test-Path -LiteralPath $pgCtlPath)) { throw 'PostgreSQL is not installed. Run npm run db:local.' }
  if ($Action -eq 'stop') { & $pgCtlPath -D $dataPath stop -m fast -w }
  else { & $pgCtlPath -D $dataPath status }
  exit $LASTEXITCODE
}

New-Item -ItemType Directory -Path $localPath -Force | Out-Null
if (!(Test-Path -LiteralPath $envPath)) {
  $randomBytes = New-Object byte[] 24
  $randomGenerator = [System.Security.Cryptography.RandomNumberGenerator]::Create()
  try { $randomGenerator.GetBytes($randomBytes) } finally { $randomGenerator.Dispose() }
  $password = [Convert]::ToBase64String($randomBytes)
  $encodedPassword = [Uri]::EscapeDataString($password)
  $envContent = @"
DATABASE_URL="postgresql://crm_admin:${encodedPassword}@127.0.0.1:5433/legal_crm?schema=public"
POSTGRES_USER=crm_admin
POSTGRES_PASSWORD=$password
POSTGRES_DB=legal_crm
POSTGRES_PORT=5433
"@
  [System.IO.File]::WriteAllText($envPath, $envContent, (New-Object System.Text.UTF8Encoding $false))
  Write-Output 'Created .env with a random local database password.'
}

$connectionMatch = [regex]::Match([System.IO.File]::ReadAllText($envPath), '(?m)^DATABASE_URL=["'']?([^"''\r\n]+)')
if (!$connectionMatch.Success) { throw 'DATABASE_URL is missing in .env.' }
$connection = [Uri]$connectionMatch.Groups[1].Value
if ($connection.Host -notin @('127.0.0.1', 'localhost')) { throw 'db:local only manages a loopback database. Existing .env was preserved.' }
$authParts = $connection.UserInfo.Split(':', 2)
$dbUser = [Uri]::UnescapeDataString($authParts[0])
$dbPassword = [Uri]::UnescapeDataString($authParts[1])
$dbName = $connection.AbsolutePath.Trim('/')
$dbPort = $connection.Port
if ($dbName -notmatch '^[a-zA-Z][a-zA-Z0-9_]*$' -or $dbUser -notmatch '^[a-zA-Z][a-zA-Z0-9_]*$' -or $dbPort -lt 1) { throw 'Invalid local database configuration.' }

if (!(Test-Path -LiteralPath (Join-Path $localPath 'postgres-runtime.ready'))) {
  & python (Join-Path $PSScriptRoot 'download-postgres.py')
  if ($LASTEXITCODE -ne 0) { throw 'PostgreSQL runtime download failed.' }
}

if (!(Test-Path -LiteralPath (Join-Path $dataPath 'PG_VERSION'))) {
  $passwordFilePath = Join-Path $localPath 'init-password.tmp'
  try {
    [System.IO.File]::WriteAllText($passwordFilePath, $dbPassword, (New-Object System.Text.UTF8Encoding $false))
    & (Join-Path $binaryPath 'initdb.exe') -D $dataPath -U $dbUser --auth=scram-sha-256 --encoding=UTF8 --locale=C "--pwfile=$passwordFilePath"
    if ($LASTEXITCODE -ne 0) { throw 'initdb failed.' }
  } finally { if (Test-Path -LiteralPath $passwordFilePath) { Remove-Item -LiteralPath $passwordFilePath -Force } }
}

& $pgCtlPath -D $dataPath status *> $null
if ($LASTEXITCODE -ne 0) {
  & $pgCtlPath -D $dataPath -l (Join-Path $localPath 'postgres.log') -o "-h 127.0.0.1 -p $dbPort" start -w
  if ($LASTEXITCODE -ne 0) { throw 'PostgreSQL startup failed. See .local/postgres.log.' }
}

$previousPassword = $env:PGPASSWORD
try {
  $env:PGPASSWORD = $dbPassword
  $exists = & (Join-Path $binaryPath 'psql.exe') -h 127.0.0.1 -p $dbPort -U $dbUser -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = '$dbName'"
  if ($LASTEXITCODE -ne 0) { throw 'Could not connect to local PostgreSQL.' }
  if ($exists -ne '1') {
    & (Join-Path $binaryPath 'createdb.exe') -h 127.0.0.1 -p $dbPort -U $dbUser $dbName
    if ($LASTEXITCODE -ne 0) { throw 'Database creation failed.' }
  }
} finally { $env:PGPASSWORD = $previousPassword }
Write-Output "PostgreSQL ready at 127.0.0.1:$dbPort / $dbName"

# 1. 추가할 경로 리스트 초기화
$pathsToAdd = @()

# 2. Node.js & Git 기본 경로 탐색
$basePaths = @("C:\Program Files\nodejs", "C:\Program Files\Git\cmd")
foreach ($bp in $basePaths) {
    if (Test-Path $bp) { $pathsToAdd += $bp }
}

# 3. Claude Code 네이티브 설치 경로 (핵심)
$claudeNativePath = Join-Path $env:USERPROFILE ".local\bin"
$claudeAppDataPath = "$env:LOCALAPPDATA\Programs\claude-code"

if (Test-Path $claudeNativePath) { $pathsToAdd += $claudeNativePath }
if (Test-Path $claudeAppDataPath) { $pathsToAdd += $claudeAppDataPath }

# 4. npm 관련 경로 (Global Prefix)
try {
    $npmPrefix = (npm config get prefix).Trim()
    if ($npmPrefix -and (Test-Path $npmPrefix)) { $pathsToAdd += $npmPrefix }
} catch {}

$defaultNpmPath = "$env:APPDATA\npm"
if (Test-Path $defaultNpmPath) { $pathsToAdd += $defaultNpmPath }

# --- 경로 등록 로직 (중복 제거 및 영구 적용) ---
$pathsToAdd = $pathsToAdd | Select-Object -Unique

$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
$currentUserPaths = $userPath.Split(';', [System.StringSplitOptions]::RemoveEmptyEntries)

$newPaths = $pathsToAdd | Where-Object { $currentUserPaths -notcontains $_ }

if ($newPaths.Count -gt 0) {
    $updatedPath = (($currentUserPaths + $newPaths) | Select-Object -Unique) -join ';'
    [Environment]::SetEnvironmentVariable("Path", $updatedPath, "User")
    Write-Host "PATH 환경 변수에 저장 완료:" -ForegroundColor Green
    $newPaths | ForEach-Object { Write-Host " - $_" }
} else {
    Write-Host "모든 경로가 이미 등록되어 있습니다." -ForegroundColor Gray
}

# --- 현재 터미널 세션에 즉시 반영 ---
$currentSessionPaths = $env:Path.Split(';', [System.StringSplitOptions]::RemoveEmptyEntries)
$env:Path = (($currentSessionPaths + $pathsToAdd) | Select-Object -Unique) -join ';'

# --- 검증 및 경로 분석 로직 ---
Write-Host "
[설치 상태 및 버전 확인]" -ForegroundColor Cyan
Write-Host "--------------------------------"

$claudeCheck = where.exe claude 2>$null
if ($claudeCheck) {
    $firstClaude = ($claudeCheck | Select-Object -First 1)
    Write-Host "Claude 실행 위치: $firstClaude"
    if ($firstClaude -like "*.localin*") {
        Write-Host "현재 '네이티브(Native)' 버전 사용 중" -ForegroundColor Yellow
    } else {
        Write-Host "현재 'npm' 패키지 버전 사용 중" -ForegroundColor Gray
    }
    try {
        $version = claude --version
        Write-Host "Claude 버전: $version"
    } catch {}
} else {
    Write-Host "Claude를 찾을 수 없습니다." -ForegroundColor Red
}

Write-Host "--------------------------------"
Write-Host "Node.js: $(try{node -v}catch{'N/A'})"
Write-Host "npm:     $(try{npm -v}catch{'N/A'})"
Write-Host "Git:     $(try{git --version}catch{'N/A'})"
Write-Host "--------------------------------"

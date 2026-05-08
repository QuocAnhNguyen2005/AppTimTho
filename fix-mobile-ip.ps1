# fix-mobile-ip.ps1
# Chay script nay de tu dong lay IP WiFi va cap nhat mobile-app/.env

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "=== Fix Mobile App IP ===" -ForegroundColor Cyan

# Lay IP WiFi chinh xac - uu tien WiFi, loai tru VirtualBox/Hyper-V/loopback
$adapters = Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
    $_.IPAddress -notlike '127.*' -and
    $_.IPAddress -notlike '169.*' -and
    $_.IPAddress -notlike '192.168.56.*' -and  # VirtualBox Host-Only
    $_.IPAddress -notlike '192.168.57.*' -and
    $_.IPAddress -notlike '172.16.*' -and       # Hyper-V/Docker
    $_.IPAddress -notlike '172.17.*' -and
    $_.IPAddress -notlike '172.18.*' -and
    $_.IPAddress -notlike '10.0.75.*'           # Hyper-V
}

Write-Host "Cac IP tim duoc:" -ForegroundColor Gray
$adapters | ForEach-Object { Write-Host "  $($_.IPAddress) (Interface: $($_.InterfaceAlias))" -ForegroundColor Gray }

# Uu tien: WiFi truoc, sau do Ethernet
$localIP = ($adapters | Where-Object { $_.InterfaceAlias -like '*Wi-Fi*' -or $_.InterfaceAlias -like '*Wireless*' } | Select-Object -First 1).IPAddress
if (-not $localIP) {
    $localIP = ($adapters | Select-Object -First 1).IPAddress
}

if (-not $localIP) {
    Write-Host ""
    Write-Host "LOI: Khong tim duoc IP WiFi!" -ForegroundColor Red
    Write-Host "Hay tu nhap IP vao mobile-app/.env:" -ForegroundColor Yellow
    Write-Host "  EXPO_PUBLIC_API_URL=http://192.168.x.x:5000/api" -ForegroundColor White
    Write-Host ""
    Write-Host "Tim IP bang lenh: ipconfig | findstr IPv4" -ForegroundColor Cyan
    exit 1
}

Write-Host ""
Write-Host "==> Su dung IP: $localIP" -ForegroundColor Green

$envPath = "$root\mobile-app\.env"
$content = @"
# AppTimTho Mobile App - Environment Variables
# File nay duoc tu dong cap nhat boi fix-mobile-ip.ps1
# IP may tinh (WiFi): $localIP

EXPO_PUBLIC_API_URL=http://${localIP}:5000/api
"@

Set-Content -Path $envPath -Value $content -Encoding UTF8
Write-Host "Da ghi: $envPath" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  EXPO_PUBLIC_API_URL=http://${localIP}:5000/api" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "==> Gio chay trong terminal mobile-app:" -ForegroundColor White
Write-Host "    npx expo start --clear" -ForegroundColor Yellow
Write-Host ""
Write-Host "==> Dam bao dien thoai cung mang WiFi voi may tinh!" -ForegroundColor Red

# cleanup.ps1
# Script tối ưu hoá dung lượng và dọn dẹp hệ thống

Write-Host "=== Cong cu Don dep & Toi uu AppTimTho ===" -ForegroundColor Cyan
Write-Host "Dang thuc hien don dep. Vui long doi..." -ForegroundColor Yellow

$root = $PSScriptRoot

# 1. Dọn dẹp Cache của Next.js (web-client)
$nextCache = "$root\web-client\.next"
if (Test-Path $nextCache) {
    Remove-Item -Recurse -Force $nextCache
    Write-Host "✅ Da xoa Next.js cache (web-client/.next)" -ForegroundColor Green
}

# 2. Dọn dẹp Cache của Vite (web-admin)
$viteCache = "$root\web-admin\node_modules\.vite"
if (Test-Path $viteCache) {
    Remove-Item -Recurse -Force $viteCache
    Write-Host "✅ Da xoa Vite cache (web-admin)" -ForegroundColor Green
}

# 3. Dọn dẹp thư mục tmp hoặc cache chung
$dirsToClean = @(
    "$root\mobile-app\.expo\web",
    "$root\web-client\node_modules\.cache",
    "$root\backend\node_modules\.cache"
)

foreach ($dir in $dirsToClean) {
    if (Test-Path $dir) {
        Remove-Item -Recurse -Force $dir -ErrorAction SilentlyContinue
        Write-Host "✅ Da xoa cache: $dir" -ForegroundColor Green
    }
}

# 4. Tìm và kill các tiến trình Node.js thừa (nếu bạn chạy start-all.ps1 nhiều lần bị kẹt)
Write-Host ""
Write-Host "Ban co muon tat TAT CA cac tien trinh Node.js dang chay ngam de giai phong RAM khong?" -ForegroundColor Cyan
Write-Host "(Luu y: Se tat luon Backend, Web-Client, Web-Admin dang chay hien tai)" -ForegroundColor Yellow
$choice = Read-Host "Nhap 'y' de tat, 'n' de bo qua (y/n)"

if ($choice -eq 'y') {
    Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Da kill toan bo tien trinh Node.js." -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Hoan tat don dep!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "De toi uu them dung luong o cung, ban hay mo cong cu 'Disk Cleanup' cua Windows." -ForegroundColor White
Write-Host "Trong VSCode, ban hay bam bieu tuong thung rac (Kill Terminal) de tat cac terminal cu nhe!" -ForegroundColor White

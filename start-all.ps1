# ============================================================
# AppTimTho - Khởi động toàn bộ hệ thống
# Chạy lệnh: .\start-all.ps1
# ============================================================

$root = $PSScriptRoot

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AppTimTho - Khoi dong he thong        " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Backend
Write-Host "[1/4] Khoi dong Backend (cong 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\backend'; Write-Host 'BACKEND' -ForegroundColor Green; node index.js"
Start-Sleep -Seconds 2

# 2. Seed database
Write-Host "[2/4] Chay seed.js tao tai khoan mau..." -ForegroundColor Yellow
Set-Location "$root\backend"
node seed.js
Write-Host "  -> Seed hoan tat!" -ForegroundColor Green
Set-Location $root
Start-Sleep -Seconds 1

# 3. Web-Client (Next.js)
Write-Host "[3/4] Khoi dong Web-Client (Next.js, cong 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\web-client'; Write-Host 'WEB-CLIENT' -ForegroundColor Blue; npm run dev"
Start-Sleep -Seconds 2

# 4. Web-Admin (Vite)
Write-Host "[4/4] Khoi dong Web-Admin (Vite, cong 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\web-admin'; Write-Host 'WEB-ADMIN' -ForegroundColor Magenta; npm run dev"
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Tat ca dich vu da duoc khoi dong!    " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Backend  : http://localhost:5000" -ForegroundColor White
Write-Host "  Web-Client: http://localhost:3000" -ForegroundColor White
Write-Host "  Web-Admin : http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "  Mobile App: Chay lenh sau trong terminal rieng:" -ForegroundColor White
Write-Host "  cd mobile-app && npx expo start" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Tai khoan test:" -ForegroundColor Cyan
Write-Host "  Admin  : admin / 123456 (dang nhap web-admin)" -ForegroundColor White
Write-Host "  Khach  : 0901234567 / 123456" -ForegroundColor White
Write-Host "  Tho    : 0909876543 / 123456" -ForegroundColor White
Write-Host ""

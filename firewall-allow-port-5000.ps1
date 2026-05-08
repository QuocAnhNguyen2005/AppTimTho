# firewall-allow-port-5000.ps1
Write-Host "=== Them rules Firewall de Mobile App ket noi duoc vao Backend ===" -ForegroundColor Cyan
Write-Host "Luu y: Chay voi quyen Administrator neu duoc yeu cau." -ForegroundColor Yellow

try {
    New-NetFirewallRule -DisplayName "AppTimTho Backend (Port 5000)" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow -ErrorAction Stop
    Write-Host "✅ Da them quy tac cho phep ket noi vao cong 5000 (Backend)" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Khong the tu dong them rule Firewall (co the ban khong chay voi quyen Admin)." -ForegroundColor Red
    Write-Host "De tu them, mo PowerShell (Run as Administrator) va chay:" -ForegroundColor White
    Write-Host "New-NetFirewallRule -DisplayName 'AppTimTho Backend' -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Nhan Enter de thoat..."
Read-Host

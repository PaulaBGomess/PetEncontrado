Start-Process powershell -ArgumentList '-NoExit','-Command','cd "'+$PWD+'"; npm run dev:api'
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList '-NoExit','-Command','cd "'+$PWD+'"; npm run dev:web'
Write-Host "API e Front-end iniciados em terminais separados." -ForegroundColor Green

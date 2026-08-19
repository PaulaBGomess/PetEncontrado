Write-Host "=== PetEncontrado V2 - Preparacao ===" -ForegroundColor Cyan
if (!(Test-Path .env)) { Copy-Item .env.example .env; Write-Host "Arquivo .env criado. Edite as chaves JWT antes de continuar." -ForegroundColor Yellow; exit }
docker compose up -d db
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
Write-Host "Pronto. Abra dois terminais e execute: npm run dev:api  e  npm run dev:web" -ForegroundColor Green

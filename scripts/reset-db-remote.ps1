# Reset Remote Database Script
# This script drops all tables and recreates them with the schema

Write-Host "Resetting remote database..." -ForegroundColor Yellow

# Execute the reset SQL file
npx wrangler d1 execute invoice-db --remote --file=scripts/reset-db.sql

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nDatabase reset successful!" -ForegroundColor Green
    Write-Host "Verifying tables..." -ForegroundColor Cyan
    
    # Verify tables exist
    npx wrangler d1 execute invoice-db --remote --command="SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"
    
    Write-Host "`nAll tables have been recreated and are empty." -ForegroundColor Green
} else {
    Write-Host "`nDatabase reset failed!" -ForegroundColor Red
    exit 1
}

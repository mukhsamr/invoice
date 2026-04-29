Get-NetTCPConnection -LocalPort 4173 -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess -Unique |
  ForEach-Object {
    if ($_ -ne $null) {
      Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
    }
  }
Start-Sleep -Seconds 1

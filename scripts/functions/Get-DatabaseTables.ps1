function Get-DatabaseTables {
    Write-Host "[INFO] Recupero delle tabelle dal database`n" -ForegroundColor Magenta

    $tables = & psql -U $env:PGUSER -d $env:PGDATABASE -h $env:PGHOST -p $env:PGPORT -t -c "SELECT tablename FROM pg_tables WHERE schemaname='public';"
    $tableList = $tables -split "`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" }

    return $tableList
}

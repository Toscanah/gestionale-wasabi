function Test-App-Running {
    param (
        [string]$ProcessName
    )
    return Get-Process -Name $ProcessName -ErrorAction SilentlyContinue
}

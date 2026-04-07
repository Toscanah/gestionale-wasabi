function Get-OS {
    if ([System.Runtime.InteropServices.RuntimeInformation]::IsOSPlatform([System.Runtime.InteropServices.OSPlatform]::Windows)) {
        return "Windows"
    }
    elseif ([System.Runtime.InteropServices.RuntimeInformation]::IsOSPlatform([System.Runtime.InteropServices.OSPlatform]::OSX)) {
        return "MacOS"
    }
    else {
        Write-Host "[ERRORE] Sistema operativo non supportato." -ForegroundColor Red
        exit 1
    }
}

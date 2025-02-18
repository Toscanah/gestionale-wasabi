. "$PSScriptRoot\Initialize-Environment.ps1"
. "$PSScriptRoot\Get-DatabaseTables.ps1"

function Invoke-Each-Table {
    param (
        [scriptblock]$actionFunction
    )

    Get-DatabaseTables | ForEach-Object {
        $tableName = $_

        if ($tableName -ne "") {
            $actionFunction.Invoke($tableName)
        }
    }
}
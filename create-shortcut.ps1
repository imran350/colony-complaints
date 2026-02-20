$desktop = [Environment]::GetFolderPath('Desktop')
$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$desktop\Colony Complaints.lnk")
$Shortcut.TargetPath = "D:\Work\claude\colony-complaints\dist\win-unpacked\Colony Complaints.exe"
$Shortcut.WorkingDirectory = "D:\Work\claude\colony-complaints\dist\win-unpacked"
$Shortcut.Description = "Colony Complaints Management System"
$Shortcut.Save()
Write-Host "Shortcut created on Desktop!"

Set WshShell = CreateObject("WScript.Shell")
WScript.Sleep 2000
WshShell.SendKeys "ola"
WshShell.SendKeys "{ENTER}"
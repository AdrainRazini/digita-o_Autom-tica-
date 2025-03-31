
        Set WshShell = CreateObject("WScript.Shell")
        WScript.Sleep 2000 ' Espera o tempo configurado antes de começar
        WshShell.SendKeys " "
        WshShell.SendKeys "{ENTER}"
    
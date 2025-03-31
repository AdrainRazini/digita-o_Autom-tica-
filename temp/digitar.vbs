Set WshShell = CreateObject("WScript.Shell")
WScript.Sleep 2000 ' Espera 2 segundos antes de comecar a digitar

texto = "oi"
WshShell.SendKeys texto
WshShell.SendKeys "{ENTER}" ' Aperta Enter no final

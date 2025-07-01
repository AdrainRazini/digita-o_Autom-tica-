function escapeSendKeys(text) {
  const replacements = {
    '+': '{+}',
    '^': '{^}',
    '%': '{%}',
    '~': '{~}',
    '(': '{(}',
    ')': '{)}',
    '{': '{{}',
    '}': '{}}',
    '[': '{[}',
    ']': '{]}'
  };
  return text.replace(/[+^%~(){}\[\]]/g, match => replacements[match]);
}

function cleanText(str) {
  return escapeSendKeys(
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove acentos
      .replace(/ç/g, "c").replace(/Ç/g, "C")
      .replace(/"/g, "'") // substitui aspas duplas
  );
}

export function generateVBS() {
  const userText = document.getElementById("userText").value.trim();
  let fileName = document.getElementById("fileName").value.trim();
  let speed = parseInt(document.getElementById("speedControl").value);

  if (!userText) {
    alert("Por favor, digite algum texto.");
    return;
  }

  if (!fileName) fileName = "escrita.vbs";
  if (!fileName.toLowerCase().endsWith(".vbs")) fileName += ".vbs";

  // ✅ Garante que a velocidade mínima será 200ms
  if (speed < 200) speed = 200;

  const cleanedText = cleanText(userText);
  const lines = cleanedText
    .split("\n")
    .map(line => `"${line.trim()}"`)
    .join(" & vbCrLf & _\n");

  const vbsCode = 
`Set WshShell = CreateObject("WScript.Shell")
Randomize
WScript.Sleep 3000 ' Espera 3 segundos antes de digitar

texto = ${lines}

For i = 1 To Len(texto)
    char = Mid(texto, i, 1)
    WshShell.SendKeys char
    WScript.Sleep Int((${speed} - 50 + 1) * Rnd + 50)
Next`;

  const blob = new Blob([vbsCode], { type: 'text/vbs' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}

window.generateVBS = generateVBS;

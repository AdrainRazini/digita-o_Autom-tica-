window.addEventListener("DOMContentLoaded", () => {
  const speedControl = document.getElementById('speedControl');
  const speedLabel = document.getElementById('speedLabel');
  const fastCheckbox = document.getElementById("fastMode");
  const fastWarning = document.getElementById("fastWarning");

  const delcheckbox = document.getElementById("delMode");
  const delWarning = document.getElementById("delWarning");

  function updateSpeedLabel() {
    speedLabel.textContent = speedControl.value + 'ms';
  }

  function handleFastModeToggle() {
    const isFast = fastCheckbox.checked;
    const isDel = delcheckbox.checked;

    // Mostrar ou esconder aviso de modo rápido
    fastWarning.style.display = isFast ? "flex" : "none";
    if (isFast) {
      fastWarning.classList.add("show");
    } else {
      fastWarning.classList.remove("show");
    }

    // Mostrar ou esconder aviso de deletar especiais
    delWarning.style.display = isDel ? "none" : "flex";
    if (isDel) {
      delWarning.classList.remove("show");
    } else {
      delWarning.classList.add("show");
    }

    // Define novo mínimo dinamicamente
    const newMin = isFast ? 50 : 200;
    speedControl.min = newMin;

    // Ajusta valor se estiver abaixo do mínimo
    if (parseInt(speedControl.value) < newMin) {
      speedControl.value = newMin;
    }

    updateSpeedLabel();
  }

  // Eventos
  speedControl.addEventListener('input', updateSpeedLabel);
  fastCheckbox.addEventListener("change", handleFastModeToggle);
  delcheckbox.addEventListener("change", handleFastModeToggle);

  // Estado inicial
  fastCheckbox.checked = false;
  delcheckbox.checked = true;

  handleFastModeToggle();
  updateSpeedLabel();



// Funções de texto e geração do VBS
function escapeSendKeys(text) {
  const replacements = {
    '+': '{+}', '^': '{^}', '%': '{%}', '~': '{~}',
    '(': '{(}', ')': '{)}', '{': '{{}', '}': '{}}',
    '[': '{[}', ']': '{]}'
  };

  if (delcheckbox.checked) {
    // Remove os caracteres especiais
    return text.replace(/[+^%~(){}\[\]]/g, '');
  } else {
    // Escapa os caracteres especiais
    return text.replace(/[+^%~(){}\[\]]/g, match => replacements[match]);
  }
}



  function cleanText(str) {
    return escapeSendKeys(
      str.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ç/g, "c").replace(/Ç/g, "C")
        .replace(/"/g, "'")
    );
  }

  window.generateVBS = function () {
    const userText = document.getElementById("userText").value.trim();
    let fileName = document.getElementById("fileName").value.trim();
    let speed = parseInt(speedControl.value);
    const fastMode = fastCheckbox.checked;

    if (!userText) {
      alert("Por favor, digite algum texto.");
      return;
    }

    if (!fileName) fileName = "escrita.vbs";
    if (!fileName.toLowerCase().endsWith(".vbs")) fileName += ".vbs";

    if (!fastMode && speed < 200) speed = 200;

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
  };
});


const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rota para gerar o script VBS
app.post('/start-typing', (req, res) => {
    const { text, delay } = req.body;

    // Geração do código VBS
    const vbsCode = `Set WshShell = CreateObject("WScript.Shell")\nWScript.Sleep ${delay}\nWshShell.SendKeys "${text}"\nWshShell.SendKeys "{ENTER}"`;

    // Caminho onde o script VBS será salvo
    const vbsFilePath = path.join(__dirname, 'temp', 'escrita.vbs');

    // Garantir que o diretório 'temp' existe
    fs.mkdirSync(path.join(__dirname, 'temp'), { recursive: true });

    // Criar e salvar o arquivo VBS
    fs.writeFileSync(vbsFilePath, vbsCode);

    // Responder com a URL para o download do VBS
    res.json({ filePath: `/download/escrita.vbs` });
});

// Rota para download do arquivo VBS
app.use('/download', express.static(path.join(__dirname, 'temp')));

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

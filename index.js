const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const app = express();

// Pasta pública para servir o HTML e CSS
app.use(express.static('public'));
app.use(express.json());

// Rota para iniciar a escrita automática
app.post('/start-typing', (req, res) => {
    const { text, delay } = req.body;  // Texto e delay recebidos do frontend
    const tempDir = path.join(__dirname, 'temp');
    
    // Verificar se a pasta temp existe, senão cria
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    // Caminho para o arquivo VBS
    const vbsPath = path.join(tempDir, 'escrita.vbs');
    
    // Gerar o código VBS
    const vbsCode = `
        Set WshShell = CreateObject("WScript.Shell")
        WScript.Sleep ${delay * 1000} ' Espera o tempo configurado antes de começar
        WshShell.SendKeys "${text.replace(/\n/g, '" & vbCrLf & "')}"
        WshShell.SendKeys "{ENTER}"
    `;

    // Criar e escrever o arquivo VBS
    fs.writeFileSync(vbsPath, vbsCode, 'utf8');

    // Executar o script VBS
    exec(`cscript //B "${vbsPath}"`, (err, stdout, stderr) => {
        if (err) {
            console.error('Erro ao executar o script:', err);
            return res.status(500).send({ error: 'Erro ao executar o script VBS' });
        }
        console.log('stdout:', stdout); // Exibe a saída do script no terminal
        res.send({ message: 'Script VBS executado com sucesso!' });
    });
});

// Iniciar o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

const express = require('express');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const INDEX = 'public/index.html';

const { startWebSocketServer, sendMessageToClients } = require('./src/websocketServer');

const server = express()
    .use(express.static('public'))
    .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
    .listen(PORT, () => console.log(`Escutando na porta ${PORT}\nDigite a mensagem a ser enviada:`));

const wss = startWebSocketServer(server);

// envia mensagem para os clientes a partir do teclado

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', line => {
    if (line === "FIM") {
        rl.close();
        wss.close();
        server.close();

        console.log("FIM! :)");
        process.exit(0);
    } else {
        sendMessageToClients(wss, line);

        console.log("Digite a mensagem a ser enviada:");
    }
    
});
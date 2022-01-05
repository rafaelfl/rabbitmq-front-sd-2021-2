const ws = require('ws');

// inicializa o servidor de websocket
const startWebSocketServer = (server) => new ws.Server({ server });

// envia uma mensagem para todos os clientes conectados
const sendMessageToClients = (wss, message) => {
    wss.clients.forEach((clientSocket) => {
        clientSocket.send(message.toString());
    });
};

module.exports = { startWebSocketServer, sendMessageToClients };

const ws = require('ws');

const startWebSocketServer = (server) => new ws.Server({ server });

const sendMessageToClients = (wss, message) => {
    wss.clients.forEach((clientSocket) => {
        clientSocket.send(message.toString());
    });
};

module.exports = { startWebSocketServer, sendMessageToClients };

const express = require('express');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const BROKER_ADDRESS = process.env.BROKER_ADDRESS || 'localhost';
const INDEX = 'public/index.html';

const { startWebSocketServer, sendMessageToClients } = require('./src/websocketServer');

const server = express()
    .use(express.static('public'))
    .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
    .listen(PORT, () => console.log(`Escutando na porta ${PORT}`));

const wss = startWebSocketServer(server);

// documentação disponível em: https://amqp-node.github.io/amqplib/
const amqp = require('amqplib/callback_api');

// conecta ao broker
amqp.connect(`amqp://${BROKER_ADDRESS}`, (err0, conn) => {
    if (err0) {
        throw err0;
    }

    // cria um canal de comunicação com o broker
    conn.createChannel((err1, ch) => {
        if (err1) {
            throw err1;
        }

        const queue = "pedidos";

        // acessa uma fila para receber mensagens
        ch.assertQueue(queue, { durable: true });

        console.log("Aguardando mensagens dos pedidos...");

        // recebe mensagens da fila
        ch.consume(queue, (msg) => {
            const pedido = JSON.parse(msg.content.toString());

            console.log(pedido);
            sendMessageToClients(wss, `ALERT: ORDER OF A PIZZA WITH FLAVOR ${pedido.sabor}, TO BE DELIVERED AT ${pedido.endereco}`);
        }, {
            noAck: true,
        });
    });
});
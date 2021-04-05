const { Router } = require('express');
const QueueController = require('./controllers/QueueController');

const routes = Router();

//Rota para derrubar chamada, recebendo o número da fila e o canal da chamada
routes.post('/hangupcall', QueueController.hangupCall);

module.exports = routes;
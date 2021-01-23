const { Router } = require('express');
const { getQueue } = require('./controllers/QueueController');

const routes = Router();

routes.get('/queue', getQueue);

module.exports = routes;
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const AMI = require('./ami/ami');

const { getQueueStatus } = require('./helper');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const server = http.createServer(app);
const io = new socketio.Server(server, {
    cors: {
        origin: '*'
    }
});

io.on('connection', socket => {
    AMI.on('managerevent', event => {
        switch (event.event) {
            case 'QueueCallerJoin':
            case 'Join':
                getQueueStatus().then(response => {
                    socket.emit('queue-status', {
                        queue: response
                    })
                }).catch(err => console.log(err));
                break;
            case 'Leave':
            case 'QueueCallerLeave':
                getQueueStatus().then(response => {
                    socket.emit('queue-status', {
                        queue: response
                    })
                }).catch(err => console.log(err));
                break;
        }
    })
});

server.listen(3334, '192.168.7.127');
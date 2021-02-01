const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const { AMI300, AMI303, AMI304, AMI305, AMI301 } = require('./ami/ami');

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
    AMI300.on('managerevent', event => {
        switch (event.event) {
            case 'QueueCallerJoin':
            case 'Join':
                getQueueStatus(AMI300).then(response => {
                    socket.emit('queue300-status', {
                        queue: response
                    })
                }).catch(err => console.log(err));
                break;
            case 'Leave':
            case 'QueueCallerLeave':
                getQueueStatus(AMI300).then(response => {
                    socket.emit('queue300-status', {
                        queue: response
                    })
                }).catch(err => console.log(err));
                break;
        }
    })
    //----------------------------------------------------------
    AMI303.on('managerevent', event => {
        switch (event.event) {
            case 'QueueCallerJoin':
            case 'Join':
                getQueueStatus(AMI303).then(response => {
                    socket.emit('queue303-status', {
                        queue: response
                    })
                }).catch(err => console.log(err));
                break;
            case 'Leave':
            case 'QueueCallerLeave':
                getQueueStatus(AMI303).then(response => {
                    socket.emit('queue303-status', {
                        queue: response
                    })
                }).catch(err => console.log(err));
                break;
        }
    })
    //-----------------------------------------------------------
    AMI304.on('managerevent', event => {
        switch (event.event) {
            case 'QueueCallerJoin':
            case 'Join':
                getQueueStatus(AMI304).then(response => {
                    socket.emit('queue304-status', {
                        queue: response
                    })
                }).catch(err => console.log(err));
                break;
            case 'Leave':
            case 'QueueCallerLeave':
                getQueueStatus(AMI304).then(response => {
                    socket.emit('queue304-status', {
                        queue: response
                    })
                }).catch(err => console.log(err));
                break;
        }
    })
    //-----------------------------------------------------------
    AMI305.on('managerevent', event => {
        switch (event.event) {
            case 'QueueCallerJoin':
            case 'Join':
                getQueueStatus(AMI305).then(response => {
                    socket.emit('queue305-status', {
                        queue: response
                    })
                }).catch(err => console.log(err));
                break;
            case 'Leave':
            case 'QueueCallerLeave':
                getQueueStatus(AMI305).then(response => {
                    socket.emit('queue305-status', {
                        queue: response
                    })
                }).catch(err => console.log(err));
                break;
        }
    })
    //-----------------------------------------------------------
    AMI301.on('managerevent', event => {
        switch (event.event) {
            case 'QueueCallerJoin':
            case 'Join':
                getQueueStatus(AMI301).then(response => {
                    socket.emit('queue301-status', {
                        queue: response
                    })
                }).catch(err => console.log(err));
                break;
            case 'Leave':
            case 'QueueCallerLeave':
                getQueueStatus(AMI301).then(response => {
                    socket.emit('queue301-status', {
                        queue: response
                    })
                }).catch(err => console.log(err));
                break;
        }
    })
});

server.listen(3334, 'localhost');
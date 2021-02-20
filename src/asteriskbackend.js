const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const ping = require('ping');
const { AMI300, AMI303, AMI304, AMI305, AMI301 } = require('./ami/ami');
const { sipmonitor303 } = require('./sipmonitorinstances');

const { getQueueStatus } = require('./helper');
const { amiList, hosts } = require('./pinginfos');

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


function startSipMonitor(ami, sipmonitor) {
    setInterval(async () => {
        ami.action({
            'action': 'SIPpeers'
        });
        sipmonitor.insertDNDStatus(ami);
    }, 5000);
}

function pingServers(socket) {
    setInterval(() => {
        hosts.forEach((host, index) => {
            ping.sys.probe(host, (alive, err) => {
                if (err) console.log(err);
                if (alive) {
                    amiList[index].action({
                        'action': 'ping'
                    }, function (err, res) {
                        if (err) {
                            socket.emit(`${host}-connection-status`, false);
                        };
                        if (res.ping === 'Pong') {
                            socket.emit(`${host}-connection-status`, true);
                        } else {
                            socket.emit(`${host}-connection-status`, false);
                        }
                    })
                } else {
                    socket.emit(`${host}-connection-status`, alive);
                }
            })
        })
    }, 5000);
}

function AmiManagerEvent(ami, socketAmiQueueName, socket, sipmonitor) {
    ami.on('managerevent', event => {
        sipmonitor.filterExtensions(event);
        switch (event.event) {
            case 'QueueCallerJoin':
            case 'Join':
                getQueueStatus(ami).then(response => {
                    socket.emit(`${socketAmiQueueName}-status`, {
                        queue: response
                    })
                }).catch(err => console.log(err));
                break;
            case 'Leave':
            case 'QueueCallerLeave':
                getQueueStatus(AMI303).then(response => {
                    socket.emit(`${socketAmiQueueName}-status`, {
                        queue: response
                    })
                }).catch(err => console.log(err));
                break;
        }
    })
}

io.on('connection', socket => {
    pingServers(socket);
    startSipMonitor(AMI303, sipmonitor303);
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
    AmiManagerEvent(AMI303, 'queue303', socket, sipmonitor303); // New use of Manager Event
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

server.listen(3334, '192.168.7.127');
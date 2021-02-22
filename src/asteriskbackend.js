const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const ping = require('ping');
const { AMI300, AMI303, AMI304, AMI305, AMI301 } = require('./ami/ami');
const { sipmonitor303, sipmonitor300, sipmonitor301, sipmonitor304, sipmonitor305 } = require('./sipmonitorinstances');

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

function startSipMonitor(ami, sipmonitor) {
    setInterval(async () => {
        ami.action({
            'action': 'SIPpeers'
        });
        sipmonitor.insertDNDStatus(ami);
        console.log(sipmonitor.finalSipNotOkArr[0]);
    }, 15000);
}


function AmiManagerEvent(ami, socketAmiQueueName, socket, sipmonitor = null) {
    ami.on('managerevent', event => {
        if (sipmonitor) {
            sipmonitor.filterExtensions(event);
        }
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
                getQueueStatus(ami).then(response => {
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
    // startSipMonitor(AMI300, sipmonitor300);
    startSipMonitor(AMI303, sipmonitor303);
    // startSipMonitor(AMI304, sipmonitor304);
    // startSipMonitor(AMI305, sipmonitor305);
    // startSipMonitor(AMI301, sipmonitor301);
    //-----------------------------------------------------------
    AmiManagerEvent(AMI300, 'queue300', socket);
    AmiManagerEvent(AMI303, 'queue303', socket, sipmonitor303);
    AmiManagerEvent(AMI304, 'queue304', socket);
    AmiManagerEvent(AMI305, 'queue305', socket);
    AmiManagerEvent(AMI301, 'queue301', socket);
});

server.listen(3334, '192.168.7.127');
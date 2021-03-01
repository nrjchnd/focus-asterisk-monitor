const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const { AMI300, AMI303, AMI304, AMI305, AMI301 } = require('./ami/ami');
const { sipmonitor303, sipmonitor300, sipmonitor301, sipmonitor304, sipmonitor305 } = require('./sipmonitorinstances');
const { getQueueStatus } = require('./helper');
const { pingServers } = require('./ping');

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

function beginSipMonitor(ami, sipmonitor, socketAmiQueueName = null) {
    setInterval(async () => {
        ami.action({
            'action': 'SIPpeers'
        });
        setTimeout(() => {
            sipmonitor.insertDNDStatus(ami)
        }, 1000);
        setTimeout(() => {
            if (socketAmiQueueName) {
                io.sockets.emit(`${socketAmiQueueName}-sip-status`, {
                    all: sipmonitor.finalSipAllArr,
                    unregistered: sipmonitor.finalSipNotOkArr,
                    dnd: sipmonitor.finalSipDndArr
                });
            }
        }, 2000);
    }, 13000);
}

function AmiManagerEvent(ami, socketAmiQueueName, sipmonitor = null) {
    ami.on('managerevent', event => {
        if (sipmonitor) {
            sipmonitor.filterExtensions(event);
        }
        switch (event.event) {
            case 'QueueCallerJoin':
            case 'Join':
                getQueueStatus(ami).then(response => {
                    io.sockets.emit(`${socketAmiQueueName}-status`, {
                        queue: response
                    })
                }).catch(err => console.log(err));
                break;
            case 'Leave':
            case 'QueueCallerLeave':
                getQueueStatus(ami).then(response => {
                    io.sockets.emit(`${socketAmiQueueName}-status`, {
                        queue: response
                    })
                }).catch(err => console.log(err));
                break;
        }
    })
}

pingServers(io);

beginSipMonitor(AMI303, sipmonitor303, 'server35');
beginSipMonitor(AMI300, sipmonitor300, 'server31');
beginSipMonitor(AMI304, sipmonitor304, 'server36');
beginSipMonitor(AMI305, sipmonitor305, 'server37');
beginSipMonitor(AMI301, sipmonitor301, 'server38');
//-----------------------------------------------------------
AmiManagerEvent(AMI303, 'queue303', sipmonitor303);
AmiManagerEvent(AMI300, 'queue300', sipmonitor300);
AmiManagerEvent(AMI304, 'queue304', sipmonitor304);
AmiManagerEvent(AMI305, 'queue305', sipmonitor305);
AmiManagerEvent(AMI301, 'queue301', sipmonitor301);

server.listen(3334, '192.168.7.127');
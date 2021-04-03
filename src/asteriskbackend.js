const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const { AMI300, AMI303, AMI304, AMI305, AMI301, MONITORAMENTO } = require('./ami/ami');
const { sipmonitor303, sipmonitor300, sipmonitor301, sipmonitor304, sipmonitor305, sipmonitorMonit } = require('./sipmonitorinstances');
const { getQueueStatus } = require('./helper');
const { pingServers } = require('./ping');
const axios = require('axios');

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
        // setTimeout(() => {
        //     sipmonitor.insertDNDStatus(ami) DND retirado
        // }, 3000);
        setTimeout(async () => {
            if (socketAmiQueueName) {
                await axios.post('http://localhost:3333/insertincidents', {
                    unregistered: sipmonitor.finalSipNotOkArr,
                    // dnd: sipmonitor.finalSipDndArr, DND retirado
                    name: socketAmiQueueName
                });
            }
        }, 5000);
    }, 13000);
}

function AmiManagerEvent(ami, socketAmiQueueName, sipmonitor = null, isMonit) {
    ami.on('managerevent', event => {
        if (sipmonitor) {
            sipmonitor.filterExtensions(event);
        }
        if (!isMonit) {
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
        }
    })
}

pingServers(io);

beginSipMonitor(AMI303, sipmonitor303, 'server35');
beginSipMonitor(AMI300, sipmonitor300, 'server31');
beginSipMonitor(AMI304, sipmonitor304, 'server36');
beginSipMonitor(AMI305, sipmonitor305, 'server37');
beginSipMonitor(AMI301, sipmonitor301, 'server38');
beginSipMonitor(MONITORAMENTO, sipmonitorMonit, 'server32');
//-----------------------------------------------------------
AmiManagerEvent(AMI303, 'queue303', sipmonitor303, false);
AmiManagerEvent(AMI300, 'queue300', sipmonitor300, false);
AmiManagerEvent(AMI304, 'queue304', sipmonitor304, false);
AmiManagerEvent(AMI305, 'queue305', sipmonitor305, false);
AmiManagerEvent(AMI301, 'queue301', sipmonitor301, false);
AmiManagerEvent(MONITORAMENTO, 'monit', sipmonitorMonit, true);

server.listen(3000, '192.168.1.143');
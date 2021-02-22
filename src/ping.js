const ping = require('ping');
const { AMI300, AMI303, AMI304, AMI305, AMI301 } = require('./ami/ami');

const hosts = [
    '192.168.1.31',
    '192.168.1.35',
    '192.168.1.36',
    '192.168.1.37',
    '192.168.1.38',
]

const amiList = [
    AMI300,
    AMI303,
    AMI304,
    AMI305,
    AMI301
]


module.exports = {
    pingServers(socket) {
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
}
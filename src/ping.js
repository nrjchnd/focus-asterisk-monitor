const ping = require('ping');

const hosts = [
    '192.168.1.31',
    '192.168.1.35',
    '192.168.1.36',
    '192.168.1.37',
    '192.168.1.38',
    '192.168.1.32'
]


module.exports = {
    pingServers(io) {
        setInterval(() => {
            hosts.forEach((host, index) => {
                ping.sys.probe(host, (alive, err) => {
                    if (err) console.log(err);
                    if (alive) {
                        io.sockets.emit(`${host}-connection-status`, true);
                    } else {
                        io.sockets.emit(`${host}-connection-status`, alive);
                    }
                })
            })
        }, 5000);
    }
}
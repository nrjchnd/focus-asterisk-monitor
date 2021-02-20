const { AMI300, AMI303, AMI304, AMI305, AMI301 } = require('./ami/ami');

exports.hosts = [
    '192.168.1.31',
    '192.168.1.35',
    '192.168.1.36',
    '192.168.1.37',
    '192.168.1.38',
]

exports.amiList = [
    AMI300,
    AMI303,
    AMI304,
    AMI305,
    AMI301
]

const AMI300 = new require('asterisk-manager')('5038', '192.168.1.31', 'turatti', '12345678', true);
const AMI303 = new require('asterisk-manager')('5038', '192.168.1.35', 'turatti', '12345678', true);

AMI300.keepConnected();
AMI303.keepConnected();

exports.AMI300 = AMI300;
exports.AMI303 = AMI303;
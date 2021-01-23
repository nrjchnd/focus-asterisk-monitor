const AMI = new require('asterisk-manager')('5038', '192.168.1.31', 'turatti', '12345678', true);

AMI.keepConnected();

module.exports = AMI;
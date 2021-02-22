const logins = require('../config/ami-login');

const AMI300 = new require('asterisk-manager')(logins[300].port, logins[300].host, logins[300].login, logins[300].password, true);
const AMI303 = new require('asterisk-manager')(logins[303].port, logins[303].host, logins[303].login, logins[303].password, true);
const AMI304 = new require('asterisk-manager')(logins[304].port, logins[304].host, logins[304].login, logins[304].password, true);
const AMI305 = new require('asterisk-manager')(logins[305].port, logins[305].host, logins[305].login, logins[305].password, true);
const AMI301 = new require('asterisk-manager')(logins[301].port, logins[301].host, logins[301].login, logins[301].password, true);

AMI300.keepConnected();
AMI303.keepConnected();
AMI304.keepConnected();
AMI305.keepConnected();
AMI301.keepConnected();

exports.AMI300 = AMI300;
exports.AMI303 = AMI303;
exports.AMI304 = AMI304;
exports.AMI305 = AMI305;
exports.AMI301 = AMI301;
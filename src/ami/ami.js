const AMI300 = new require('asterisk-manager')('5038', '192.168.1.31', 'painelcentral', 'Payn&[49!3F@cus', true);
const AMI303 = new require('asterisk-manager')('5038', '192.168.1.35', 'painelcentral', 'Payn&[49!3F@cus', true);
const AMI304 = new require('asterisk-manager')('5038', '192.168.1.36', 'painelcentral', 'Payn&[49!3F@cus', true);
const AMI305 = new require('asterisk-manager')('5038', '192.168.1.37', 'painelcentral', 'Payn&[49!3F@cus', true);
const AMI301 = new require('asterisk-manager')('5038', '192.168.1.38', 'painelcentral', 'Payn&[49!3F@cus', true);

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
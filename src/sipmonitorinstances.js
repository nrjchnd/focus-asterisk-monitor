const { AMI300, AMI303, AMI304, AMI305, AMI301 } = require('./ami/ami');
const { SipMonitor } = require('./sipmonitor');

exports.sipmonitor303 = new SipMonitor(AMI303);
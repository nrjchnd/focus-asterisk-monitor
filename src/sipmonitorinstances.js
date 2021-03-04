const { AMI300, AMI303, AMI304, AMI305, AMI301, MONITORAMENTO } = require('./ami/ami');
const { SipMonitor } = require('./sipmonitor');

exports.sipmonitor300 = new SipMonitor(AMI300);
exports.sipmonitor303 = new SipMonitor(AMI303);
exports.sipmonitor304 = new SipMonitor(AMI304);
exports.sipmonitor305 = new SipMonitor(AMI305);
exports.sipmonitor301 = new SipMonitor(AMI301);
exports.sipmonitorMonit = new SipMonitor(MONITORAMENTO);
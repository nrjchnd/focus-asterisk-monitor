const AMI = require('./ami/ami');

exports.getQueueStatus = function getQueueStatus() {
    return new Promise((resolve, reject) => {
        AMI.action({ action: 'QueueStatus' }, async function (err, res) {
            if (!err) {
                let response = await getListEvents(AMI, res.actionid, 'QueueStatusComplete');
                let queues = {};

                response.map(el => {
                    if (el.queue === 'default') {
                        return;
                    }

                    fillQueuesData(queues, el);
                });

                resolve(queues);

            } else {
                resolve('Teste');
            }
        })
    })
}

function fillQueuesData(queues, el) {
    if (!queues[el.queue]) {
        queues[el.queue] = {
            members: [],
            entries: [],
            params: {}
        };
    }

    switch (el.event) {
        case 'QueueMember':
            let sip = el.location ? el.location.match(/\d+/) : '';
            el.sip = sip ? sip[0] : '';
            el.login = el.name;
            el.online = el.status !== '0' && el.status !== '5';

            el.status = QUEUE_MEMBER_STATUS[el.status];

            queues[el.queue].members.push(el);
            break;
        case 'QueueParams':
            queues[el.queue].params = el;
            break;
        case 'QueueEntry':
            el.date = new Date();
            queues[el.queue].entries.push(el);
            break;
    }
}

async function getListEvents(AMI, actionId, lastEvent) {
    let result = [];

    let promise = new Promise((resolve, reject) => {
        let listener = AMI.on('managerevent', f);

        function f(evt) {
            if (evt.actionid === actionId) {
                if (evt.event === lastEvent) {
                    listener.removeListener('managerevent', f);
                    resolve(result);
                } else {
                    result.push(evt);
                }
            }
        }
    });

    return await promise;
};

QUEUE_MEMBER_STATUS = {
    '0': 'SIP_STATUS_UNAVAILABLE', //'AST_DEVICE_UNKNOWN',
    '1': 'SIP_STATUS_IDLE',
    '2': 'SIP_STATUS_IN_USE',
    '3': 'SIP_STATUS_BUSY',
    '4': 'SIP_STATUS_UNAVAILABLE', //'AST_DEVICE_INVALID',
    '5': 'SIP_STATUS_UNAVAILABLE',
    '6': 'SIP_STATUS_RINGING',
    '7': 'SIP_STATUS_IN_USE', //'AST_DEVICE_RINGINUSE',
    '8': 'SIP_STATUS_ON_HOLD'
};
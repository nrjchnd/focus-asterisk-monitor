const { getQueueStatus } = require('../helper');

exports.getQueue = async function (req, res, next) {
    const data = await getQueueStatus();
    res.send(data);
}


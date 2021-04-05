const { AMI300, AMI303, AMI304, AMI305, AMI301 } = require('../ami/ami');

module.exports = {
    async hangupCall(req, res) {
        const { queue, channel } = req.query;
        if (queue !== undefined && channel !== undefined) {
            //Compara o número da fila para saber em qual servidor mandar o comando para derrubar chamada
            switch (queue) {
                case '300':
                    //Envia o comando para derrubar a chamada no servidor com o canal recebido
                    await AMI300.action({
                        'action': 'hangup',
                        'channel': channel
                    });
                    break;
                case '303':
                    await AMI303.action({
                        'action': 'hangup',
                        'channel': channel
                    });
                    break;
                case '304':
                    await AMI304.action({
                        'action': 'hangup',
                        'channel': channel
                    });
                    break;
                case '305':
                    await AMI305.action({
                        'action': 'hangup',
                        'channel': channel
                    });
                    break;
                case '301':
                    await AMI301.action({
                        'action': 'hangup',
                        'channel': channel
                    });
                    break;
                case '302':
                    await AMI301.action({
                        'action': 'hangup',
                        'channel': channel
                    });
                    break;
            }
        }
        return res.send();
    }
}
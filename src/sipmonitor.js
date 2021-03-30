class SipMonitor {
    constructor(ami) {
        this.tempSipArr = [];
        this.tempSipAllArr = [];
        this.finalSipNotOkArr = [];
        this.finalSipAllArr = [];
        this.finalSipDndArr = [];
        this.ami = ami;
    }

    getDndEntries(ami) {
        return new Promise(async (resolve, reject) => {
            await ami.action({
                'action': 'Command',
                'command': 'database show'
            }, function (err, evt) {
                try {
                    resolve(evt.content.match(/\/DND\/\d+/g));
                } catch (err) {
                    resolve(['Permission Denied']);
                }
            })
        })
    }

    async insertDNDStatus(ami) {
        let DNDArr = await this.getDndEntries(ami);
        if (DNDArr) {
            DNDArr.map(dnd => {
                let extension = dnd.match(/\d+/g);
                if (extension) {
                    this.finalSipAllArr.map(async peer => {
                        if (peer.objectname === extension[0]) {
                            peer.dnd = true;
                            peer.timestamp = Date.now();
                            peer.name = await this.getExtensionName(peer.objectname, ami);
                            this.finalSipDndArr.push(peer);
                        } else if (peer.objectname !== extension[0] && peer.dnd === undefined) {
                            peer.dnd = false;
                        }
                    })
                }
            })
        } else {
            this.finalSipAllArr.map(peer => {
                peer.dnd = false;
            })
        }
    }

    getExtensionName(extension, ami) {
        return new Promise(async (resolve, reject) => {
            await ami.action({
                'action': 'SIPshowpeer',
                'peer': extension
            }, function (err, evt) {
                if (err) console.log(err);
                if (!err) resolve(evt.callerid);
            });
        })
    }

    filterExtensions(evt) {
        if (evt.event === 'PeerEntry') {
            this.tempSipAllArr.push(evt);
            if (!evt.status.includes('OK') && Number(evt.objectname) <= 15000) {
                this.tempSipArr.push({
                    ...evt,
                    timestamp: Date.now(),
                    recognized: false
                });
            }
        }
        if (evt.event === 'PeerlistComplete') {
            this.finalSipNotOkArr = this.tempSipArr;
            this.finalSipAllArr = this.tempSipAllArr;
            this.tempSipArr = [];
            this.tempSipAllArr = [];
            this.finalSipDndArr = [];
            this.finalSipNotOkArr.map(async peer => {
                peer.name = await this.getExtensionName(peer.objectname, this.ami);
            })
        }
    }

    deleteDND(ami, extension) {
        ami.action({
            'action': 'DBdeltree',
            'family': 'DND',
            'key': extension.toString()
        })
    }

}

module.exports = {
    SipMonitor
}
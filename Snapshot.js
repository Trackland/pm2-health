"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Fs = require("fs");
const os_1 = require("os");
const Http_1 = require("./Http");
class Snapshot {
    constructor(_config) {
        this._config = _config;
        this._data = {
            host: os_1.hostname(),
            snapshot: {}
        };
        if (!this._config.snapshot)
            this._config.snapshot = {};
        this._data.token = this._config.snapshot.token;
    }
    push(id, app, key, v) {
        if (!this._data.snapshot[id])
            this._data.snapshot[id] = { app: app, metric: {} };
        this._data.snapshot[id].metric[key] = v;
    }
    last(id, key) {
        if (!this._data.snapshot[id] || !this._data.snapshot[id].metric[key])
            return undefined;
        return this._data.snapshot[id].metric[key].v;
    }
    dump() {
        this._data.timeStamp = new Date().getTime();
        Fs.writeFile(`History_${new Date().toISOString()}.json`, JSON.stringify(this._data), (ex) => {
            if (ex)
                console.error(`Can't dump history, ${ex.message || ex}`);
        });
    }
    async send() {
        if (!this._config.snapshot.url || !this._config.snapshot.token || this._config.snapshot.disabled === true)
            return;
        try {
            this._data.timeStamp = new Date().getTime();
            await Http_1.httpFetch(this._config.snapshot.url, JSON.stringify(this._data));
        }
        catch (ex) {
            console.error(`http push failed: ${ex.message || ex}`);
        }
    }
}
exports.Snapshot = Snapshot;
//# sourceMappingURL=Snapshot.js.map
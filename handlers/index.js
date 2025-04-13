"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
exports.default = {
    handler: {
        ping: async (num) => {
            return await electron_1.ipcRenderer.invoke('ping', num);
        },
    },
};

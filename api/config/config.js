"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newDbConfig = exports.newConfig = void 0;
var zod_1 = require("zod");
var Config = zod_1.z.object({
    port: zod_1.z.number(),
    dbFileName: zod_1.z.string(),
    corsOrigin: zod_1.z.string(),
});
function newConfig() {
    return Config.parse({
        port: Number(process.env.PORT),
        dbFileName: process.env.DB_FILE_NAME,
        corsOrigin: process.env.CORS_ORIGIN,
    });
}
exports.newConfig = newConfig;
function newDbConfig() {
    return Config.pick({ dbFileName: true }).parse({
        dbFileName: process.env.DB_FILE_NAME,
    });
}
exports.newDbConfig = newDbConfig;
exports.default = newConfig;

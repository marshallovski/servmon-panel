import { hostname, tmpdir } from 'node:os';
import { polkaApp, serverId } from "../server.js";

import send from '@polka/send-type';

import * as _config from "../config.json" with { type: 'json' };
import { osInfo } from 'systeminformation';

const config = _config.default;

polkaApp.get('/server/info/env', async (req, res) => {
    const osInfoData = await osInfo();    

    const response = {
        ok: true,
        serverId,
        version: config.version,
        hostname: hostname(),
        tmpdir: tmpdir(),
        node: process.version,
        os: osInfoData.logofile,
        panelRamUsage: `${(process.memoryUsage().rss / 1024 ** 2).toFixed(1)} MB`
    };

    return send(res, 200, response);
});
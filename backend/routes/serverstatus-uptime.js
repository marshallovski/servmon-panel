import { polkaApp, serverId } from "../server.js";
import send from '@polka/send-type';

import { time } from "systeminformation";

polkaApp.get('/server/status/hardware/uptime', async (req, res) => {
    const uptime = time()?.uptime;

    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = uptime % 60;

    const response = {
        ok: true,
        serverId,
        hours,
        minutes,
        seconds: Number(seconds?.toFixed())
    };

    return send(res, 200, response);
});
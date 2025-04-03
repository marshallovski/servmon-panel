import { polkaApp } from "../server.js";
import send from '@polka/send-type';

import { mem, memLayout } from "systeminformation";

polkaApp.get('/server/status/hardware/ram', async (req, res) => {
    const memData = await mem();
    const memLayoutData = await memLayout();    

    const response = {
        ok: true,
        total: memData?.total / (1024 * 1024),
        free: memData?.free / (1024 * 1024),
        used: memData?.active / (1024 * 1024),
        type: memLayoutData[0].type
    };    

    return send(res, 200, response);
});
import send from '@polka/send-type';
import { diskLayout, fsSize } from "systeminformation";
import { polkaApp } from "../server.js";

polkaApp.get('/server/status/hardware/storage', async (req, res) => {
    const diskLayoutData = await diskLayout();
    const diskData = await fsSize();

    let list = [];

    for (let i = 0; i < diskData.length; i++) {
        list.push({
            drive: diskLayoutData[i].name,
            mount: diskData[i].mount,
            totalGB: Number(((diskData[i].size / (1024 * 1024 * 1024)).toFixed(1))),
            usedGB: Number(((diskData[i].used / (1024 * 1024 * 1024)).toFixed(1))),
            freeGB: Number(((diskData[i].available / (1024 * 1024 * 1024)).toFixed(1))),
            usePercentage: diskData[i].use
        });
    }

    const response = {
        ok: true,
        list
    };
    
    return send(res, 200, response);
});
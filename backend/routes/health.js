import { polkaApp } from "../server.js";
import send from '@polka/send-type';

polkaApp.get('/server/health', async (req, res) => {
    return send(res, 200, {
        ok: true
    });
});


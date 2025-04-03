import send from '@polka/send-type';
import { osInfo, system } from "systeminformation";
import { polkaApp } from "../server.js";

polkaApp.get('/server/info/host', async (req, res) => {
    const systemData = await system();
    const os = await osInfo();

    const response = {
        ok: true,
        name: `${systemData.manufacturer} ${systemData.model} ${systemData.version}`,
        virtual: systemData.virtual,
        platform: os.platform,
        release: `${os.distro} ${os.release} (${os.kernel})`,
        arch: os.arch,
        os: os.distro
    };

    return send(res, 200, response);
});
import send from '@polka/send-type';
import { polkaApp } from "../server.js";
import { graphics } from "systeminformation";

polkaApp.get('/server/info/hardware/gpu', async (req, res) => {
    const gpuData = await graphics();

    const gpuMainData = gpuData?.controllers[0];
    const mainDisplayData = gpuData.displays.find(m => m.main === true);

    const response = {
        ok: true,
        list: gpuData?.controllers,
        displays: gpuData?.displays,
        display: {
            vendor: mainDisplayData.vendor,
            model: mainDisplayData.model,
            connection: mainDisplayData.connection,
            resolution: `${mainDisplayData.currentResX}x${mainDisplayData.currentResY}`,
            refreshRate: mainDisplayData.currentRefreshRate
        },
        main: {
            vendor: gpuMainData?.vendor,
            vendorId: gpuMainData?.vendorId,
            model: gpuMainData?.model,
            vram: gpuMainData?.vram
        },
    };

    return send(res, 200, response);
});
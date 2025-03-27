import send from '@polka/send-type';
import { cpu, cpuCurrentSpeed, cpuTemperature, currentLoad } from "systeminformation";
import { polkaApp } from "../server.js";

polkaApp.get('/server/status/hardware/cpu', async (req, res) => {
    const cpuData = await cpu();
    const cpuCurrentSpeedData = await cpuCurrentSpeed();
    const temp = await cpuTemperature();

    const response = {
        ok: true,
        name: `${cpuData.manufacturer} ${cpuData.brand}`,
        cores: cpuData.cores,
        speedMax: cpuData.speedMax,
        speed: cpuCurrentSpeedData.avg,
        usage: (await currentLoad()).currentLoad.toFixed(),
        temp: temp.main,
        virtualization: cpuData.virtualization
    };

    return send(res, 200, response);
});
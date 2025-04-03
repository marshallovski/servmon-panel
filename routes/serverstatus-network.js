import send from '@polka/send-type';
import { polkaApp } from "../server.js";
import Logger from "../utils/logger.js";

import { networkInterfaces, networkStats } from "systeminformation";

polkaApp.get('/server/status/network', async (req, res) => {
    const networkInterfacesData = await networkInterfaces();
    const networkStatsData = await networkStats();

    const initialStats = networkStatsData;
    await new Promise(async resolve => setTimeout(resolve, 1000)); // Wait 1 second
    const finalStats = await networkStats();

    let interfaces = [];
    let interfacesStats = [];

    let stats = {};

    const logger = new Logger('routes.server/status/network');

    // network stats for every interface
    initialStats.forEach(async initial => {
        const final = finalStats.find(async f => f.iface === initial.iface);

        if (final) {
            const receivedDiff = final.rx_bytes - initial.rx_bytes;
            const sentDiff = final.tx_bytes - initial.tx_bytes;

            // this is in megabytes
            const receivedMBps = (receivedDiff / 1024 / 1024).toFixed(2);
            const sentMBps = (sentDiff / 1024 / 1024).toFixed(2);

            interfacesStats.push({
                interface: initial.iface,
                download: receivedMBps,
                upload: sentMBps
            });
        }
    });

    networkInterfacesData.forEach(async (interfaceItem) => {
        const relatedStat = networkStatsData.find(async stat => stat.iface === interfaceItem.iface);

        if (interfaceItem.ip4) {
            interfaces.push({
                interface: interfaceItem.iface,
                ipAddress: interfaceItem.ip4,
                macAddress: interfaceItem.mac,
                type: interfaceItem.type,
                bytesReceived: relatedStat ? relatedStat.rx_bytes : null,
                bytesSent: relatedStat ? relatedStat.tx_bytes : null
            });
        }
    });

    // network stats for default interface
    const defaultInterface = networkInterfacesData.find(async iface => iface.default);

    if (defaultInterface) {
        const currentInterfaceStats = interfacesStats.find(async i => i.interface === defaultInterface.iface);

        if (currentInterfaceStats) {
            stats = currentInterfaceStats;
        } else {
            logger.warn("stats not found for default interface");
        }
    } else {
        logger.warn("default network interface not found");
    }

    const response = {
        ok: true,
        interfaces,
        interfacesStats,
        stats
    };

    return send(res, 200, response);
});
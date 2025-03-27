import panelAPI from './index.js';
import Logger from '$lib/utils/logger.js';

async function serverInfo(endpointKey) {
    const logger = new Logger(`api/serverInfo/${endpointKey}`);

    if (!endpointKey) return logger.error('no `endpointKey` provided!');

    try {
        const req = await fetch(`${panelAPI.serverInfoURL}/${endpointKey}`);

        if (!req.status === 200) return logger.error(`failed to fetch: ${req?.status} (${req?.statusText})`);

        const res = await req.json();

        if (!res.ok) logger.warn(`server error: ${res?.message}`);

        return res;
    } catch {
        return false;
    }
}

export default serverInfo;
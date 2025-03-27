import panelAPI from './index.js';
import Logger from '$lib/utils/logger.js';

async function serverStatus(endpointKey) {
    const logger = new Logger(`api/serverStatus/${endpointKey}`);

    if (!endpointKey) return logger.error('no `endpointKey` provided!');

    try {
        if (!endpointKey) return logger.error('no `endpointKey` provided!');

        const req = await fetch(`${panelAPI.statusURL}/${endpointKey}`);

        if (!req.status === 200) return logger.error(`failed to fetch: ${req?.status} (${req?.statusText})`);

        const res = await req.json();

        if (!res.ok) logger.warn(`server error: ${res?.message}`);
        
        return res;
    } catch {
        return false;
    }
}

export default serverStatus;
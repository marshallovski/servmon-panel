import panelAPI from './index.js';
import Logger from '../utils/logger.js';

panelAPI.serverStatus = async (endpointKey) => {
    const logger = new Logger(`api/serverStatus/${endpointKey}`);

    if (!endpointKey) return logger.error('no `endpointKey` provided!');

    try {
        if (!endpointKey) return logger.error('no `endpointKey` provided!');

        const req = await fetch(`${panelAPI.statusURL}/${endpointKey}`);

        if (!req.status === 200) return logger.error(`failed to fetch: ${req?.status} (${req?.statusText})`);

        const res = await req.json();
        return res;
    } catch {
        return false;
    }
}
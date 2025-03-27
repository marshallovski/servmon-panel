import panelAPI from './index.js';
import Logger from '../utils/logger.js';

panelAPI.serverInfo = async (endpointKey) => {
    const logger = new Logger(`api/serverInfo/${endpointKey}`);

    if (!endpointKey) return logger.error('no `endpointKey` provided!');

    try {
        const req = await fetch(`${panelAPI.serverInfoURL}/${endpointKey}`);

        if (!req.status === 200) return logger.error(`failed to fetch: ${req?.status} (${req?.statusText})`);

        const res = await req.json();
        return res;
    } catch {
        return false;
    }
}
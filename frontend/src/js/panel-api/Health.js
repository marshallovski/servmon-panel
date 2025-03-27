import Logger from '../utils/logger.js';
import panelAPI from './index.js';

const logger = new Logger('api/Health');

panelAPI.health = async () => {
    try {
        const req = await fetch(`${panelAPI.baseURL}/health`);

        if (!req.status === 200) return logger.error(`failed to fetch: ${req?.status} (${req?.statusText})`);

        const res = await req.json();
        return res;
    } catch {
        return false;
    }
}
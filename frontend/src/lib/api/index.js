import config from "../config.js";
import health from "./Health.js";
import serverInfo from "./serverInfo.js";
import serverStatus from "./serverStatus.js";

class PanelAPI {
    constructor(url) {
        this.url = url;
        this.baseURL = `${this.url}/server`;
        this.statusURL = `${this.baseURL}/status`;
        this.serverInfoURL = `${this.baseURL}/info`;


        this.hardwareStatusURL = `${this.statusURL}/hardware`;
    }

    async health() {
        return await health();
    }

    async serverInfo(endpointKey) {
        return await serverInfo(endpointKey);
    }

    async serverStatus(endpointKey) {
        return await serverStatus(endpointKey);
    }
}

const panelAPI = new PanelAPI(config.api.url);

export default panelAPI;
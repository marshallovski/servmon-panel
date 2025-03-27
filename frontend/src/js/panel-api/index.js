import config from "../config.js";

class PanelAPI {
    constructor(url) {
        this.url = url;
        this.baseURL = `${this.url}/server`;
        this.statusURL = `${this.baseURL}/status`;
        this.serverInfoURL = `${this.baseURL}/info`;


        this.hardwareStatusURL = `${this.statusURL}/hardware`;
    }

    async health() {}
    async serverInfo(endpointKey) {}
    async serverStatus(endpointKey) {}
}

const panelAPI = new PanelAPI(config.api.url);

window.panelAPI = panelAPI;

export default panelAPI;
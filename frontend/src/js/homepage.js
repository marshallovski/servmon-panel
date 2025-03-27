import panelAPI from "./panel-api/index.js";

import "./components/navbar.js";

const serverOnline = await panelAPI.health();

// if (!serverOnline) location.href = '/pages/server-offline.html';

// const navbarHostname = Alpine.$refs.navbarHostnameTitle;

// console.log(navbarHostname);

document.addEventListener('alpine:init', async () => {
    Alpine.store('navbarStore', {
        getTitle: async (params) => {
            return 'gg'
        }
    });
});




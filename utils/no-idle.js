const axios = require('axios');

let name;
const ping = _ => {
    axios.get(`https://${name}.herokuapp.com/`).catch((e) => {
        console.error(e);
        ping();
    });
};

module.exports = (appName) => {
    name = appName;
    setInterval(ping, 1000 * 60 * 20); //  self ping every 20 mins to prevent idling
};
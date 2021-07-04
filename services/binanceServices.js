const axios = require('axios');
axios.defaults.baseURL = 'https://api1.binance.com/api/v3/';


module.exports = {
    get:  async function(endpoint, params) {
        return await axios.get(endpoint, {
            params: params
        })
    }
} 
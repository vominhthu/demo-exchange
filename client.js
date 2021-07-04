const WebSocket = require('ws');

const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade/bnbusdt@trade');

ws.on('message', function incoming(data) {
    console.log(data);
});
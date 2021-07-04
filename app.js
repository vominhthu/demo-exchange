const app = require("express")();
const server = require("http").createServer(app);
const cors = require('cors')
app.use(cors({
  origin: '*'
}))
const _ = require("lodash");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", () => {
  io.emit("coin-list", {});
});

var coins = require("./const/contants").coins;

const updateCoinPrice = (price) => {
  if (!price || _.isEmpty(coins)) return;
  const pair = JSON.parse(price);
  let indexCoin = coins.findIndex((coin) => coin.symbol === pair.s);
  if (indexCoin !== -1) {
    coins[indexCoin].price = convertCoinToVND(pair.p);
  }
};

const convertCoinToVND = (price) => {
  return Math.ceil(parseFloat(price).toFixed(2) * 25000);
};
const WebSocket = require("ws");
const ws = new WebSocket(
  "wss://stream.binance.com:9443/ws/btcusdt@trade/adausdt@trade/ethusdt@trade/xrpusdt@trade"
);

ws.on("message", function incoming(response) {
  if (response) {
    updateCoinPrice(response);
  }
});

setInterval(function () {
  io.emit("coin-list", coins);
}, 10000);

app.get("/coin/:slug", async function (req, res, next) {
  let slug = req.params.slug;
  if (!["ada", "btc", "xrp", "eth"].includes(slug)) {
    res.json({
      error: 1,
      msg: "Coin not found",
      timestamp: new Date().getTime(),
    });
    return next();
  }
  let coin = await getTickerPrice(slug);
  coin.name = slug.toUpperCase();
  res.json({
    error: 0,
    data: coin,
    timestamp: new Date().getTime(),
  });
  return next();
});
const getTickerPrice = async(coin) => {
  const binanceServices = require('./services/binanceServices');
  let data = {};
  const response = await binanceServices.get('ticker/price', {
    symbol: `${coin}USDT`.toUpperCase()
  });
  if (response.status === 200 && response.statusText === 'OK') {
    data = response.data;
    data.price = convertCoinToVND(data.price)
  }
  return data;
}
app.use('/', function(req, res, next) {
  res.json("Hello world")
});
app.use('/healthy', function(req, res, next) {
  res.json("Hello world")
});
const port = 8888;
const host = "10.128.0.2"
server.listen(port, host);
console.log(`Server running`)


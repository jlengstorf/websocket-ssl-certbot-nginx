const path = require("path");
const http = require("http");
const WebSocket = require("ws");
const express = require("express");

const app = express();

app.use(express.static(path.join(__dirname, "../client")));

const server = http.createServer(app);
const wss = new WebSocket.Server({ clientTracking: false, noServer: true });

// when the client opens a WebSocket connection, handle it here
server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, ws => {
    wss.emit("connection", ws, request);
  });
});

// listen for a WebSocket connection, then we can do stuff
// for now, just send a ping every 5 seconds
let ping;
wss.on("connection", ws => {
  clearInterval(ping);
  ping = setInterval(() => {
    ws.send(JSON.stringify("ping"));
  }, 5000);
});

server.listen(8080, () => {
  console.log(`Listening on http://localhost:${server.address().port}`);
});

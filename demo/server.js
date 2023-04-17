const https = require('https');
const fs = require('fs');

const WebSocket = require('ws');
const express = require('express');
const app = express();

const PORT = 8080;

const server = https.createServer({
  cert: fs.readFileSync('server.crt'),
  key: fs.readFileSync('server.key')
}, app);

const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (data) => {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

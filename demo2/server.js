const WebSocket = require('ws');
const Speech = require('@google-cloud/speech');
const speech = new Speech.SpeechClient({
    projectId: 'your-project-id',
    keyFilename: '/path/to/keyfile.json',
});
const PORT = 8080;

const wss = new WebSocket.Server({ port: PORT });

wss.on('connection', function connection(ws) {
  console.log('Client connected');

  const recognizeStream = speech
    .streamingRecognize({
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
      },
      interimResults: true,
    })
    .on('data', data => {
      ws.send(JSON.stringify(data.results[0].alternatives[0].transcript));
    });

  ws.on('message', function incoming(data) {
    recognizeStream.write(data);
  });

  ws.on('close', function() {
    console.log('Client disconnected');
    recognizeStream.destroy();
  });
});

console.log(`Server running at http://localhost:${PORT}`);

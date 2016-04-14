'use strict';
const http = require('http');
const ELM = require('../index');

const monitoring = new ELM(5000, 10);
monitoring.start(true);
const monitoring2 = new ELM(5000, 10);
monitoring2.start();
let response = 'no data';

monitoring.on('data', (data) => {
  response = JSON.stringify(data);
});

// Create an HTTP server
const server = http.createServer((req, res) => {
  console.info(`Latency: \n ${response}`);
  console.info(`Latency: \n ${monitoring2.countLatency()}`);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(response);
});
server.listen(8000);

"use strict";
const http = require('http'),
    ELM = require('../index');

const monitoring = new ELM(5000, 10);
let response = 'no data';

monitoring.on('data', (data) => {
    response = JSON.stringify(data);
});

// Create an HTTP server
let server = http.createServer( (req, res) => {
    console.info(`Latency: \n ${response}`);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(response);
});
server.listen(8000);
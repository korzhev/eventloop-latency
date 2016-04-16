# eventloop-latency

[![Build Status](https://travis-ci.org/korzhev/eventloop-latency.svg?branch=master)](https://travis-ci.org/korzhev/eventloop-latency)
[![Coverage Status](https://coveralls.io/repos/github/korzhev/eventloop-latency/badge.svg?branch=master)](https://coveralls.io/github/korzhev/eventloop-latency?branch=master)
[![Code Climate](https://codeclimate.com/github/korzhev/eventloop-latency/badges/gpa.svg)](https://codeclimate.com/github/korzhev/eventloop-latency)
[![Issue Count](https://codeclimate.com/github/korzhev/eventloop-latency/badges/issue_count.svg)](https://codeclimate.com/github/korzhev/eventloop-latency)

This lib is part of [Bronitor](https://github.com/korzhev/bronitor) project. It counts eventloop latency using [process.hrtime](https://nodejs.org/dist/latest-v4.x/docs/api/process.html#process_process_hrtime)

## Requirements
**Code written using ECMAScript 2015. It tested on node >= 4**

Use babel if, you want to use it on node < 4

## Installation
```bash
$ npm install eventloop-latency
```

## Usage
```js
const EL = require('eventloop-latency'),
	interval = 5000, 
	hrInterval = 10, 
	monitoring = new EL(interval, hrInterval);
   
monitoring.start(true);   
monitoring.on('data', (data) => {
  console.log(data); // {"pid": 13424, "ticks": [49, 27, ..., 144, 923]}
});
monitoring.stop();
  
monitoring.start();
setInterval(() => {
   console.log(monitoring.countLatency()); // [149, 7, ..., 14, 92]
}, 1000) 
```

## Docs
- **monitoring** - main object, eventemitter, takes two options:
    - **iterval** - interval in *ms* for emitting **'data' event**, optional, defaults to 5000 *ms*
    - **hrIntreval** - interval in *ms* using to count latency, should be in range 10-100, optional, defaults to 10 *ms*
- **start()** - function, that start monitoring, takes option:
    - **enableEmit** - if *true*, **monitoring** will emit **"data" event**, else function **countLatency()** is used to get latency info
- **stop()** - function, that stop monitoring
- **countLatency()** - function, that return array with latency
- **"data" event** - returns object:
	 - **pid** - is process id
	 - **ticks** - array of latency in *µs*(microseconds, 10e-6 s) during the **interval**

## Examples
You can see small example in **demos/server.js**. Run it:
```bash
$ npm run-script demo
```

## Tests
  To run the test suite, first install the dependencies, then run `npm test`:
```bash
$ npm install
$ npm test
```

## License
  [MIT](LICENSE)

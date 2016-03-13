# eventloop-latency

[![Build Status](https://travis-ci.org/korzhev/eventloop-latency.svg?branch=master)](https://travis-ci.org/korzhev/eventloop-latency)
[![Coverage Status](https://coveralls.io/repos/github/korzhev/eventloop-latency/badge.svg?branch=master)](https://coveralls.io/github/korzhev/eventloop-latency?branch=master)

This lib is part of [Bronitor](https://github.com/korzhev/bronitor) project. It counts eventloop latency using [process.hrtime](https://nodejs.org/dist/latest-v4.x/docs/api/process.html#process_process_hrtime)

## Warning
*Code written using ECMAScript 2015. It tested on node >= 4*

## Installation
```bash
$ npm install eventloop-latency
```

## Usage
```js
const EL = require('eventloop-latency'),
	iterval = 5000, 
	hrIntreval = 10, 
	monitoring = new EL(interval, hrInteral);
   
monitoring.on('data', (data) => {
   console.log(data); // {"pid": 13424, "ticks": [-49, -27, ..., 144, 923]}
});
```

## Docs
 - **monitoring** - main object, eventemitter
 - **iterval** - interval in *ms* for emitting **'data' event**, optional, defaults to 5000 *ms*
 - **hrIntreval** - interval in *ms* using to count latency, should be in range 10-100, optional, defaults to 10 *ms*
 - **"data" event** - returns object:
	 - **pid** - is process id
	 - **ticks** - array of latency in *?s*(microseconds, 10e?6 s) during the **interval**

## Examples
You can see small example in **demos/server.js**. Run it:
```bash
$ node ./demos/server.js
```

## Tests
  To run the test suite, first install the dependencies, then run `npm test`:
```bash
$ npm install
$ npm test
```

## License
  [MIT](LICENSE)
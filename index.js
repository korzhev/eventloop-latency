'use strict';

const EE = require('events').EventEmitter;

class EventLoopMonitor extends EE {
  /**
   * @constructor
   * @param interval - interval between two events "data"
   * @param hrInterval - interval to compare with hrtime
   */
  constructor(interval, hrInterval) {
    super();
    this._time = process.hrtime();
    this.latency = [];
    this._ticks = [];
    this._hrInterval = hrInterval || 100;
    this._interval = interval || 5000;
    this._eventInterval = null;
    this._loopMonitorInterval = null;

    this._validateInteval();
  }

  /**
   *
   * @private
   */
  _validateInteval() {
    if (!Number.isInteger(this._interval) || !Number.isInteger(this._hrInterval) ||
      this._interval < 1000 ||
      this._hrInterval < 10 ||
      this._hrInterval >= 1000
    ) throw new Error('Interval should be integer, first one > 1000, second one in range 10-1000');
  }

  /**
   * finding diff between 2 hrtime
   */
  countLatency() {
    this.latency.length = 0;
    this._ticks.forEach((hrTick, i) => {
      if (i === 0) return;
      const latencyItem = Math.floor((
        hrTick[0] * 1e9 + hrTick[1] -
        (this._ticks[i - 1][0] * 1e9 + this._ticks[i - 1][1])
        - this._hrInterval * 1e6) / 1e3
      );
      if (latencyItem < 0) return;
      this.latency.push(latencyItem);
    });
    this._ticks.length = 0;
    this._time = process.hrtime();
    return this.latency;
  }

  /**
   *
   * @private
   */
  _startToEmmit() {
    this._eventInterval = setInterval(() => {
      this.emit('data', this.countLatency());
    }, this._interval);
  }

  /**
   *
   * @param enableEmit
   */
  start(enableEmit) {
    this._loopMonitorInterval = setInterval(() => {
      this._ticks.push(process.hrtime(this._time));
    }, this._hrInterval);
    if (enableEmit) this._startToEmmit();
  }

  /**
   *
   */
  stop() {
    clearInterval(this._loopMonitorInterval);
    clearInterval(this._eventInterval);
    this._ticks.length = 0;
    this.latency.length = 0;
  }
}

module.exports = EventLoopMonitor;

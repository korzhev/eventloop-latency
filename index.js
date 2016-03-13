'use strict';

const EE = require('events').EventEmitter,
    PID = process.pid;

class EventLoopMonitor extends EE {
    /**
     * @param interval - interval between two events "data"
     * @param hrInterval - interval to compare with hrtime
     */
    constructor(interval, hrInterval) {
        super();
        this._time = process.hrtime();
        this.latency = [];
        this._ticks = [];
        this._hrInterval = hrInterval || 10;
        this._interval = interval || 5000;
        this._eventInterval = null;
        this._loopMonitorInterval = null;
        if (!Number.isInteger(this._interval) ||
            !Number.isInteger(this._hrInterval) ||
            this._interval <= 100 ||
            this._hrInterval < 10 ||
            this._hrInterval >= 100
        ) throw new Error('Interval should be positive integer, in range 10-100');

        this.start();
    }

    /**
     * finding diff between 2 hrtime
     */
    _countLatency() {
        this._ticks.forEach((hrTick, i) => {
                if (i === 0) return;
                this.latency.push(Math.floor((
                    hrTick[0] * 1e9 + hrTick[1] -
                    ( this._ticks[i - 1][0] * 1e9 + this._ticks[i - 1][1] )
                    - this._hrInterval * 1e6 ) / 1e3
                ));
            }
        );
        return this.latency;
    }

    start () {
        this._loopMonitorInterval = setInterval(() => {
            this._ticks.push(process.hrtime(this._time));
        }, this._hrInterval);
        this._eventInterval = setInterval(() => {
            this.emit('data', {
                    pid: PID,
                    ticks: this._countLatency()
                }
            );
            this._ticks.length = 0;
            this.latency.length = 0;
            this._time = process.hrtime();
        }, this._interval);
    }

    stop() {
        clearInterval(this._loopMonitorInterval);
        clearInterval(this._eventInterval);
        this._ticks.length = 0;
        this.latency.length = 0;
    }
}

module.exports = EventLoopMonitor;
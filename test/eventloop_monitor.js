"use strict";

const ELM = require('../index');

describe('Eventloop latency', function() {

    describe('#stop()', function() {
        it('should stop monior, and clear intervals', function() {
            let elm = new ELM();
            elm.stop();
            elm._ticks.length.should.equal(0);
            elm.latency.length.should.equal(0);
            elm._loopMonitorInterval._idleTimeout.should.equal(-1);
            elm._eventInterval._idleTimeout.should.equal(-1);
        });
    });

    describe('#start()', function() {
        it('should start monitor and emit soon "data" event with data obj', function(done) {
            let elm = new ELM(50);
            elm.on('data', function(data) {
                data.pid.should.be.Number();
                data.ticks.should.be.Array();
                data.ticks.length.should.be.above(0);
                data.ticks[0].should.be.Number();
                done();
            })
        });
    });

    describe('#_countLatency()', function() {
        it('should return array with latency', function() {
            const HRI = 10,
                testData = {
                    latency: [],
                    _hrInterval: HRI,
                    _ticks:[
                    [0, 1e5],
                    [0, 2e5],
                    [1, 1e5],
                    [3, 3e5]
                ]},
                resultData = [
                    (2e5 - 1e5 - HRI*1e6)/1e3,
                    (1e9 + 1e5 - 2e5 - HRI*1e6)/1e3,
                    (3e9 + 3e5 - 1e9 - 1e5 - HRI*1e6)/1e3
                ];

            let testLatency = ELM.prototype._countLatency.call(testData);
            testLatency.should.deepEqual(resultData);
        });
    });

});

'use strict';

const ELM = require('../index');
const chai = require('chai');
const expect = chai.expect;

chai.should();
chai.use(require('chai-interface'));

describe('Eventloop latency', () => {
  describe('#constructor()', () => {
    it('should create monior', () => {
      const elm = new ELM(1000, 10);
      elm.should.be.instanceOf(ELM);
      expect(() => {new ELM('10h', 10); }).to.throw(Error);
      expect(() => {new ELM(1000, '10');}).to.throw(Error);
      expect(() => {new ELM(1000, 1);}).to.throw(Error);
      expect(() => {new ELM(100, 20);}).to.throw(Error);
    });
  });


  describe('#stop()', () => {
    it('should stop monior, and clear intervals', () => {
      const elm = new ELM();
      elm.start(true);
      elm.stop();
      elm._ticks.length.should.equal(0);
      elm.latency.length.should.equal(0);
      elm._loopMonitorInterval._idleTimeout.should.equal(-1);
      elm._eventInterval._idleTimeout.should.equal(-1);
    });
  });

  describe('#start()', () => {
    it('should start monitor and emit soon "data" event with data obj', (done) => {
      const elm = new ELM(101);
      elm.start(true);
      elm.on('data', function (data) {
        data.should.have.interface({
          pid: Number,
          ticks: Array,
        });
        data.ticks.length.should.be.above(0);
        data.ticks[0].should.be.a('number');
        elm.stop();
        done();
      });
    });

    it('should start monitor, and wait for #countLatency()', (done) => {
      const elm = new ELM(101);
      elm.start();
      setTimeout(() => {
        elm._ticks.should.be.instanceof(Array);
        elm._ticks.should.not.be.empty;
        elm.stop();
        elm._loopMonitorInterval._idleTimeout.should.equal(-1);
        expect(elm._eventInterval).to.be.equal(null);
        done();
      }, 30);
    });
  });

  describe('#countLatency()', () => {
    it('should return array with latency', () => {
      const HRI = 10;
      const testData = {
        latency: [100, 200],
        _hrInterval: HRI,
        _time: [0, 100],
        _ticks: [
          [0, 1e5],
          [0, 2e5],
          [1, 1e5],
          [3, 3e5],
        ],
      };
      const resultData = [
        (1e9 + 1e5 - 2e5 - HRI * 1e6) / 1e3,
        (3e9 + 3e5 - 1e9 - 1e5 - HRI * 1e6) / 1e3
      ];

      const testLatency = ELM.prototype.countLatency.call(testData);
      testLatency.should.be.deep.equal(resultData);
      testData.latency.should.be.deep.equal(resultData);
      testData._ticks.should.be.deep.equal([]);
      testData._time.should.not.be.deep.equal([0, 200]);
    });
  });
});

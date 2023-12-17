import HazelModule from '../src/module.js';
import assert from 'assert';

describe('HazelModule', function () {
  it('should be a class', function () {
    assert.equal(typeof HazelModule, 'function');
  });

  it('should extend Map', function () {
    assert(Map.prototype.isPrototypeOf(HazelModule.prototype));
  });

  describe('constructor', function () {
    it('should throw a TypeError if moduleName is not a string', function () {
      assert.throws(() => new HazelModule(), TypeError);
      assert.throws(() => new HazelModule(null), TypeError);
      assert.throws(() => new HazelModule(1), TypeError);
      assert.throws(() => new HazelModule({}), TypeError);
      assert.throws(() => new HazelModule([]), TypeError);
      assert.throws(() => new HazelModule(true), TypeError);
      assert.throws(() => new HazelModule(Symbol()), TypeError);
    });

    it('should set name to HazelModule.name', function () {
      const moduleName = 'test';
      const module = new HazelModule(moduleName);
      assert.equal(module.name, moduleName);
    });

    it('should return a HazelModule instance', function () {
      assert(new HazelModule('test') instanceof HazelModule);
    });
  });

  describe('HazelModule.prototype.setPriority', function () {
    it('should throw a TypeError if type is not a Symbol', function () {
      const module = new HazelModule('test');
      assert.throws(() => module.setPriority(undefined, 1), TypeError);
      assert.throws(() => module.setPriority(null, 1), TypeError);
      assert.throws(() => module.setPriority(1, 1), TypeError);
      assert.throws(() => module.setPriority({}, 1), TypeError);
      assert.throws(() => module.setPriority([], 1), TypeError);
      assert.throws(() => module.setPriority(true, 1), TypeError);
      assert.throws(() => module.setPriority('test', 1), TypeError);
    });

    it('should throw a TypeError if value is not a number', function () {
      const module = new HazelModule('test');
      assert.throws(() => module.setPriority(Symbol()), TypeError);
      assert.throws(() => module.setPriority(Symbol(), null), TypeError);
      assert.throws(() => module.setPriority(Symbol(), 'test'), TypeError);
      assert.throws(() => module.setPriority(Symbol(), {}), TypeError);
      assert.throws(() => module.setPriority(Symbol(), []), TypeError);
      assert.throws(() => module.setPriority(Symbol(), true), TypeError);
    });

    it('should set priority', function () {
      const module = new HazelModule('test');
      const type = Symbol();
      const value = 1;
      module.setPriority(type, value);
      assert.equal(module.priority.get(type), value);
    });

    it('should return true', function () {
      const module = new HazelModule('test');
      assert(module.setPriority(Symbol(), 1));
    });
  });

  describe('HazelModule.prototype.getPriority', function () {
    it('should throw a TypeError if type is not a Symbol', function () {
      const module = new HazelModule('test');
      assert.throws(() => module.getPriority(), TypeError);
      assert.throws(() => module.getPriority(null), TypeError);
      assert.throws(() => module.getPriority(1), TypeError);
      assert.throws(() => module.getPriority({}), TypeError);
      assert.throws(() => module.getPriority([]), TypeError);
      assert.throws(() => module.getPriority(true), TypeError);
      assert.throws(() => module.getPriority('test'), TypeError);
    });

    it('should return Infinity if type is not set', function () {
      const module = new HazelModule('test');
      assert.equal(module.getPriority(Symbol()), Infinity);
    });

    it('should return priority', function () {
      const module = new HazelModule('test');
      const type = Symbol();
      const value = 1;
      module.setPriority(type, value);
      assert.equal(module.getPriority(type), value);
    });
  });
});

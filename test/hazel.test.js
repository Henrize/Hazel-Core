import Hazel from '../src/hazel.js';
import assert from 'assert';

let lastError = null;

function testErrorHandler(hazel, error) {
  lastError = error;
}

function reflectFunction(hazel, x) {
  return x;
}

const emptyFunction = new Function();

describe('Hazel', function () {
  it('should be a class', function () {
    assert.equal(typeof Hazel, 'function');
  });

  describe('constructor', function () {
    it('should throw a TypeError if config is not an object', function () {
      assert.throws(() => new Hazel(1), TypeError);
      assert.throws(() => new Hazel('test'), TypeError);
      assert.throws(() => new Hazel([]), TypeError);
      assert.throws(() => new Hazel(true), TypeError);
      assert.throws(() => new Hazel(Symbol()), TypeError);
    });

    it('should set config to Hazel.prototype.config', function () {
      let testConfig = { test: true };
      let hazel = new Hazel(testConfig);
      assert.equal(hazel.config, testConfig);
    });

    it('should return a Hazel instance', function () {
      assert(new Hazel() instanceof Hazel);
    });
  });

  describe('Hazel.prototype.set', function () {
    const hazel = new Hazel();

    it('should successfully bind error handler', function () {
      assert(hazel.set('error', testErrorHandler));
      assert(hazel.modules.has('error'));
      assert(hazel.modules.get('error').get(Hazel.type.executor) === testErrorHandler);
    });

    it('should call error handler if name is not a string', function () {
      hazel.set(1, emptyFunction);
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.set(null, emptyFunction);
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.set([], emptyFunction);
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.set(true, emptyFunction);
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.set(Symbol(), emptyFunction);
      assert(lastError instanceof TypeError);
      lastError = null;
    });

    it('should call error handler if target is not a function', function () {
      hazel.set('test', 1);
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.set('test', null);
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.set('test', []);
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.set('test', {});
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.set('test', true);
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.set('test', Symbol());
      assert(lastError instanceof TypeError);
      lastError = null;
    });

    it('should call error handler if priority is not a number', function () {
      hazel.set('test', emptyFunction, { priority: [] });
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.set('test', emptyFunction, { priority: {} });
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.set('test', emptyFunction, { priority: true });
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.set('test', emptyFunction, { priority: Symbol() });
      assert(lastError instanceof TypeError);
      lastError = null;
    });

    it('should call error handler if type is not a symbol', function () {
      hazel.set('test', emptyFunction, { type: [] });
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.set('test', emptyFunction, { type: {} });
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.set('test', emptyFunction, { type: true });
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.set('test', emptyFunction, { type: 1 });
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.set('test', emptyFunction, { type: 'test' });
      assert(lastError instanceof TypeError);
      lastError = null;
    });

    hazel.set('test', emptyFunction);

    it('should set type to Hazel.type.executor if type is not set', function () {
      assert(hazel.modules.get('test').get(Hazel.type.executor) === emptyFunction);
    });

    it('should set priority to Infinity if priority is not set', function () {
      assert(hazel.modules.get('test').getPriority(Hazel.type.executor) === Infinity);
    });

    it('should bind a function as expected and return true', function () {
      const moduleName = 'test-module';
      const modulePriority = 16;
      assert(hazel.set(moduleName, emptyFunction, { type: Hazel.type.launcher, priority: modulePriority }));
      assert(hazel.modules.has(moduleName));
      assert(hazel.modules.get(moduleName).get(Hazel.type.launcher) === emptyFunction);
      assert(hazel.modules.get(moduleName).getPriority(Hazel.type.launcher) === modulePriority);
    });
  });

  describe('Hazel.prototype.delete', function () {
    const hazel = new Hazel();
    hazel.set('error', testErrorHandler);

    it('should call error handler if name is not a string', function () {
      hazel.delete(1);
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.delete(null);
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.delete([]);
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.delete(true);
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.delete(Symbol());
      assert(lastError instanceof TypeError);
      lastError = null;
    });

    it('should call error handler if type is not a symbol', function () {
      hazel.delete('test', 1);
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.delete('test', []);
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.delete('test', {});
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.delete('test', true);
      assert(lastError instanceof TypeError);
      lastError = null;
    });

    hazel.set('test', emptyFunction);

    it('should delete a function and return true', function () {
      assert(hazel.delete('test', Hazel.type.executor));
      assert(!hazel.modules.get('test').has(Hazel.type.executor));
      assert(hazel.modules.has('test'));
    });

    it('should delete entire module if type is not provided', function () {
      assert(hazel.delete('test'));
      assert(!hazel.modules.has('test'));
    });
  });

  describe('Hazel.prototype.has', function () {
    const hazel = new Hazel();
    hazel.set('error', testErrorHandler);
    hazel.set('test', emptyFunction);

    it('should call error handler if name is not a string', function () {
      hazel.has(1);
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.has(null);
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.has([]);
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.has(true);
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.has(Symbol());
      assert(lastError instanceof TypeError);
      lastError = null;
    });

    it('should call error handler if type is not a symbol', function () {
      hazel.has('test', 1);
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.has('test', []);
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.has('test', {});
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.has('test', true);
      assert(lastError instanceof TypeError);
      lastError = null;
    });

    it('should return false if module does not exist', function () {
      assert(!hazel.has('not-exist'));
    });

    it('should return false if function does not exist', function () {
      assert(!hazel.has('test', Hazel.type.launcher));
    });

    it('should return true if function exists', function () {
      assert(hazel.has('test', Hazel.type.executor));
    });
  });

  describe('Hazel.prototype.run', function () {
    const hazel = new Hazel();
    hazel.set('error', testErrorHandler);
    hazel.set('reflect', reflectFunction);

    it('should call error handler if name is not a string', async function () {
      await hazel.run(1, Symbol());
      assert(lastError instanceof TypeError);
      lastError = null;

      await hazel.run(null, Symbol());
      assert(lastError instanceof TypeError);
      lastError = null;

      await hazel.run([], Symbol());
      assert(lastError instanceof TypeError);
      lastError = null;

      await hazel.run(true, Symbol());
      assert(lastError instanceof TypeError);
      lastError = null;

      await hazel.run(Symbol(), Symbol());
      assert(lastError instanceof TypeError);
      lastError = null;
    });

    it('should call error handler if type is not a symbol', async function () {
      await hazel.run('reflect', 1);
      assert(lastError instanceof TypeError);
      lastError = null;

      await hazel.run('reflect', []);
      assert(lastError instanceof TypeError);
      lastError = null;

      await hazel.run('reflect', {});
      assert(lastError instanceof TypeError);
      lastError = null;

      await hazel.run('reflect', true);
      assert(lastError instanceof TypeError);
      lastError = null;
    });

    it('should call error handler if module does not exist', async function () {
      await hazel.run('not-exist', Symbol());
      assert(lastError instanceof Error);
      lastError = null;
    });

    it('should call error handler if function does not exist', async function () {
      await hazel.run('reflect', Hazel.type.launcher);
      assert(lastError instanceof Error);
      lastError = null;
    });

    it('should run a function and return its result', async function () {
      const testResult = Symbol();
      assert(await hazel.run('reflect', Hazel.type.executor, testResult) === testResult);
    });

    it('should run a module executor if type is not provided', async function () {
      const testResult = Symbol();
      assert(await hazel.run('reflect', null, testResult) === testResult);
      assert(await hazel.run('reflect') === undefined);
    });

    it('should call error handler if function throws an error', async function () {
      const testError = new Error('test');
      hazel.set('throw', () => { throw testError; });
      await hazel.run('throw');
      assert(lastError === testError);
      lastError = null;
    });
  });

  describe('Hazel.prototype.traverse', function () {
    const hazel = new Hazel();
    hazel.set('error', testErrorHandler);
    hazel.set('reflect', reflectFunction);

    it('should call error handler if type is not a symbol', async function () {
      await hazel.traverse(1);
      assert(lastError instanceof TypeError);
      lastError = null;

      await hazel.traverse([]);
      assert(lastError instanceof TypeError);
      lastError = null;

      await hazel.traverse({});
      assert(lastError instanceof TypeError);
      lastError = null;

      await hazel.traverse(true);
      assert(lastError instanceof TypeError);
      lastError = null;
    });

    it('should traverse functions of a specific type in order of priority', async function () {
      let result = [];
      hazel.set(
        'test2',
        async () => {
          result.push(2);
        },
        { type: Hazel.type.launcher, priority: 2 }
      );
      hazel.set(
        'test1',
        async () => {
          result.push(1);
        },
        { type: Hazel.type.launcher, priority: 1 }
      );
      hazel.set(
        'test3',
        async () => {
          result.push(3);
        },
        { type: Hazel.type.launcher }
      );
      await hazel.traverse(Hazel.type.launcher);
      assert.deepEqual(result, [1, 2, 3]);
    });

    it('should call error handler if function throws an error', async function () {
      const testError = new Error('test');
      hazel.set('throw', () => { throw testError; });
      await hazel.traverse(Hazel.type.executor);
      assert(lastError === testError);
      lastError = null;
    });
  });

  describe('Hazel.prototype.error', function () {
    const hazel = new Hazel();
    hazel.set('error', testErrorHandler);

    it('should call error handler if error is not an error', function () {
      hazel.error(1);
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.error(null);
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.error([]);
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.error(true);
      assert(lastError instanceof TypeError);
      lastError = null;

      hazel.error(Symbol());
      assert(lastError instanceof TypeError);
      lastError = null;
    });

    it('should call error handler if error is an error', function () {
      const testError = new Error('test');
      hazel.error(testError);
      assert(lastError === testError);
      lastError = null;
    });
  });
});

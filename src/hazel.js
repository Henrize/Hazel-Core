/**
 * @file The Hazel Core class.
 * @author Henrize <mail@henrize.kim>
 * @license MIT
 */

import constants from './constants.js';
import HazelModule from './module.js';

/**
 * Class representing Hazel, used to instantiate a Hazel Core instance.
 * @class
 */
class Hazel {
  /**
   * Export all Hazel Core constants.
   * @type {object}
   */
  static type = {
    /** launcher function will be used to initialize a module. Like listening to a port etc. */
    launcher: constants.moduleLauncher,

    /** executor function will be used to execute a module. Like handling a request etc. */
    executor: constants.moduleExecutor,

    /** terminator function will be used to terminate a module. before the module being deleted. */
    terminator: constants.moduleTerminator,

    __proto__: null,
  };

  /**
   * Default Hazel Core configuration.
   * @type {object}
   */
  config = {};

  /**
   * Stores all modules.
   * @type {Map<string, HazelModule>}
   */
  modules = new Map();

  /**
   * Hazel Core constructor function.
   * @constructor
   * @param {object} [config] - A valid Hazel Core configuration.
   */
  constructor(config) {
    if (typeof config !== 'undefined' && config !== null) {
      if (typeof config !== 'object' || Array.isArray(config)) {
        throw new TypeError('Configuration must be an object, received ' + typeof config);
      } else {
        this.config = config;
      }
    }
  }

  /**
   * Bind a function to a new or existing module.
   * @public
   * @param {string} name - The name of the module.
   * @param {function} target - The function to bind.
   * @param {Object} [options] - Options for the function.
   * @param {Symbol} [options.type] - The type of the function.
   * @param {number} [options.priority] - The priority of the function.
   * @returns {boolean} - Whether the function was bound.
   */
  set(name, target, options = {
    type: constants.moduleExecutor,
    priority: Infinity,
  }) {
    try {
      if (typeof name !== 'string') {
        this.error(new TypeError('Name of the module must be a string, received ' + typeof name));
        return false;
      }
      if (typeof target !== 'function') {
        this.error(new TypeError('Target must be a function, received ' + typeof target));
        return false;
      }
      if (typeof options !== 'object') {
        this.error(new TypeError('Options must be an object, received ' + typeof options));
        return false;
      }

      if (typeof options.type === 'undefined' || options.type === null) {
        options.type = constants.moduleExecutor;
      } else if (typeof options.type !== 'symbol') {
        this.error(new TypeError('Type of the function must be a symbol, received ' + typeof options.type));
        return false;
      }
      if (typeof options.priority === 'undefined' || options.priority === null) {
        options.priority = Infinity;
      } else if (typeof options.priority !== 'number') {
        this.error(new TypeError('Priority of the function must be a number, received ' + typeof options.priority));
        return false;
      }

      if (!this.modules.has(name)) {
        this.modules.set(name, new HazelModule(name));
      }

      this.modules.get(name).set(options.type, target);
      this.modules.get(name).setPriority(options.type, options.priority);
    } catch (error) {
      this.error(error);
    }
    return true;
  }

  /**
   * Remove a function from a module.
   * @public
   * @param {string} name - The name of the module.
   * @param {Symbol} [type] - The type of the function.
   * @returns {boolean} - Whether the function was removed.
   */
  delete(name, type) {
    try {
      if (typeof name !== 'string') {
        this.error(new TypeError('Name of the module must be a string, received ' + typeof name));
        return false;
      }

      if (typeof type === 'undefined' || type === null) {
        if (!this.modules.has(name)) {
          this.error(new Error('Module \'' + name + '\' not found'));
          return false;
        }

        this.modules.delete(name);
      } else if (typeof type !== 'symbol') {
        this.error(new TypeError('Type of the function must be a symbol, received ' + typeof type));
        return false;
      } else {
        this.modules.get(name).delete(type);
      }
    } catch (error) {
      this.error(error);
    }
    return true;
  }

  /**
   * Check if a module exists.
   * @public
   * @param {string} name - The name of the module.
   * @param {Symbol} [type] - The type of the function(optional).
   * @returns {boolean} - Whether the module exists.
   */
  has(name, type) {
    if (typeof name !== 'string') {
      this.error(new TypeError('Name of the module must be a string, received ' + typeof name));
      return false;
    }
    if (!this.modules.has(name)) {
      return false
    }
    if (typeof type === 'undefined' || type === null) {
      return true;
    } else if (typeof type !== 'symbol') {
      this.error(new TypeError('Type of the function must be a symbol, received ' + typeof type));
      return false;
    }
    return this.modules.get(name).has(type);
  }

  /**
   * Execute a function from a module.
   * @public
   * @param {string} name - The name of the module.
   * @param {Symbol} [type] - The type of the function.
   * @param {...any} args - Arguments to pass to the function.
   */
  async run(name, type, ...args) {
    let result;
    try {
      if (typeof name !== 'string') {
        this.error(new TypeError('Name of the module must be a string'));
        return false;
      }
      if (typeof type === 'undefined' || type === null) {
        type = constants.moduleExecutor;
      }
      if (typeof type !== 'symbol') {
        this.error(new TypeError('Type of the function must be a symbol'));
        return false;
      }
      if (!this.has(name, type)) {
        this.error(new Error('Module or function not found'));
        return false;
      }

      result = await this.modules.get(name).get(type)(this, ...args);
    } catch (error) {
      this.error(error);
    }
    return result;
  }

  /**
   * Run all functions of a specific type from all modules.
   * @public
   * @param {Symbol} type - The type of the function.
   * @param {...any} args - Arguments to pass to the function.
   * @returns {boolean} - Whether the functions were executed.
   */
  async traverse(type, ...args) {
    try {
      if (typeof type !== 'symbol') {
        this.error(new TypeError('Type of the function must be a symbol'));
        return false;
      }

      let targetFunctionList = [];
      for (const module of this.modules.values()) {
        if (module.has(type)) {
          targetFunctionList.push([module.get(type), module.getPriority(type)]);
        }
      }
      targetFunctionList.sort((a, b) => a[1] - b[1]);
      for (const targetFunction of targetFunctionList) {
        await targetFunction[0](this, ...args);
      }
    } catch (error) {
      this.error(error);
    }
    return true;
  }

  /**
   * Hazel Core default error handler.
   * @public
   * @param {Error} error - The error to handle.
   * @returns {void}
   */
  error(error) {
    try {
      if (!Error.prototype.isPrototypeOf(error)) {
        this.error(new TypeError('Error must be an instance of Error'));
      } else if (this.has('error', constants.moduleExecutor)) {
        this.run('error', constants.moduleExecutor, error)
          .catch((error) => { console.error(error); });
      } else {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export default Hazel;

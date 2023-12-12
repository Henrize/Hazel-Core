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
  static constants = constants;

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
   * @param {object} config - A valid Hazel Core configuration.
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * Bind a function to a new or existing module.
   * @public
   * @param {string} name - The name of the module.
   * @param {Symbol} type - The type of the function.
   * @param {function} target - The function to bind.
   * @returns {boolean} - Whether the function was bound.
   */
  set(name, type, target) {
    try {
      if (typeof name !== 'string') {
        this.error(new TypeError('Name of the module must be a string, received ' + typeof name));
        return false;
      }
      if (typeof type !== 'symbol') {
        this.error(new TypeError('Type of the function must be a symbol, received ' + typeof type));
        return false;
      }
      if (typeof target !== 'function') {
        this.error(new TypeError('Target function must be a function, received ' + typeof target));
        return false;
      }

      if (!this.modules.has(name)) {
        this.modules.set(name, new HazelModule(name));
      }
      this.modules.get(name).moduleFunctions.set(type, target);
    } catch (error) {
      this.error(error);
      return false;
    }
    return true;
  }

  /**
   * Remove a function from a module.
   * @public
   * @param {string} name - The name of the module.
   * @param {Symbol} type - The type of the function.
   * @returns {boolean} - Whether the function was removed.
   */
  delete(name, type) {
    try {
      if (!this.modules.has(name)) {
        this.error(new Error('Module not found'));
        return false;
      }
      if (typeof type !== 'symbol') {
        this.error(new TypeError('Type of the function must be a symbol, received ' + typeof type));
        return false;
      }

      this.modules.get(name).moduleFunctions.delete(type);
    } catch (error) {
      this.error(error);
    }
    return true;
  }

  /**
   * Delete a module.
   * @public
   * @param {string} name - The name of the module.
   * @returns {boolean} - Whether the module was deleted.
   */
  deleteModule(name) {
    try {
      if (typeof name !== 'string') {
        this.error(new TypeError('Name of the module must be a string, received ' + typeof name));
        return false;
      }
      if (!this.modules.has(name)) {
        this.error(new Error('Module not found'));
        return false;
      }

      this.modules.delete(name);
    } catch (error) {
      this.error(error);
    }
    return true;
  }

  /**
   * Check if a module exists.
   * @public
   * @param {string} name - The name of the module.
   * @param {Symbol} type - The type of the function(optional).
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
    if (typeof type === 'symbol') {
      return this.modules.get(name).moduleFunctions.has(type);
    } else {
      if (typeof type !== 'undefined') {
        this.error(new TypeError('Type of the function must be a symbol, received ' + typeof type));
        return false;
      }
      if (this.modules.get(name).moduleFunctions.size > 0) {
        return true;
      }
    }
    return false;
  }

  /**
   * Execute a function from a module.
   * @public
   * @param {string} name - The name of the module.
   * @param {Symbol} type - The type of the function.
   * @param {...any} args - Arguments to pass to the function.
   */
  async run(name, type, ...args) {
    let result;
    try {
      if (typeof name !== 'string') {
        this.error(new TypeError('Name of the module must be a string'));
        return false;
      }
      if (typeof type !== 'symbol') {
        this.error(new TypeError('Type of the function must be a symbol'));
        return false;
      }
      if (!this.has(name, type)) {
        this.error(new Error('Module or function not found'));
        return false;
      }

      result = this.modules.get(name).moduleFunctions.get(type)(...args);
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

      for (const module of this.modules.values()) {
        if (module.moduleFunctions.has(type)) {
          await module.moduleFunctions.get(type)(...args);
        }
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
      }
      if (this.has('error', constants.moduleExecutor)) {
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

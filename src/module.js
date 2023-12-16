/**
 * @file The Hazel Core Module class.
 * @author Henrize <mail@henrize.kim>
 * @license MIT
 */

/**
 * Class representing a Hazel Module.
 * HazelModule is designed to easily store
 * and manage modules information and execution.
 * @class
 * @extends {Map}
 */
class HazelModule extends Map {
  /**
   * The name of the module.
   * @public
   * @type {string}
   */
  name = 'UNNAMED';

  /**
   * Priority of the each function.
   * @public
   * @type {Map<Symbol, number>}
   */
  priority = new Map();

  /**
   * HazelModule constructor function.
   * @constructor
   * @param {string} moduleName - The name of the module.
   * @throws {TypeError} - If moduleName is not a string.
   */
  constructor(moduleName) {
    if (typeof moduleName !== 'string') {
      throw new TypeError('moduleName must be a string');
    }
    super();
    this.name = moduleName;
  }

  /**
   * Priority setter.
   * @public
   * @param {Symbol} type - The type of the function.
   * @param {number} value - The priority value.
   * @returns {boolean} - Whether the priority was set.
   */
  setPriority(type, value) {
    if (typeof value !== 'number') {
      throw new TypeError('Priority value must be a number, received ' + typeof value);
    }
    this.priority.set(type, value);
    return true;
  }

  /**
   * Priority getter.
   * @public
   * @param {Symbol} type - The type of the function.
   * @returns {number} - The priority value.
   */
  getPriority(type) {
    if (this.priority.has(type)) {
      return this.priority.get(type);
    } else {
      return Infinity;
    }
  }
}

export default HazelModule;

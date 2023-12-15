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
}

export default HazelModule;

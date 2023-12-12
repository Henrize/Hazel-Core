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
 */
class HazelModule {
  /**
   * The name of the module.
   * @public
   * @type {string}
   * @default 'UNNAMED_MODULE'
   */
  moduleName = 'UNNAMED_MODULE';

  /**
   * Stores all functions of the module.
   * @public
   * @type {Map<Symbol, function>}
   */
  moduleFunctions = new Map();

  /**
   * If this module is loaded from a file,
   * this property will contain properties
   * of the file.
   * @public
   * @type {object}
   * @default null
   */
  fileProperties = {
    /**
     * To specify if this module is loaded
     * from a file or not.
     * @type {boolean}
     * @default false
     */
    isLoadedFromFile: false,

    /**
     * The path of the file.
     * @type {string}
     * @default null
     */
    path: null,

    /**
     * The last modified date of the file.
     * @type {Date}
     * @default null
     */
    lastModified: null,
  };

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
    this.moduleName = moduleName;
  }

  /**
   * Sets a function to the module.
   * @public
   * @param {Symbol} functionType - The type of the function.
   * @param {function} target - The function.
   * @returns {boolean} - Whether the function was set.
   * @throws {TypeError} - If functionType is not a symbol.
   */
  setFunction(functionType, target) {
    if (typeof functionType !== 'symbol') {
      throw new TypeError('functionType must be a symbol');
    }

    if (typeof target !== 'function') {
      throw new TypeError('target must be a function');
    }

    this.moduleFunctions.set(functionType, target);
    return true;
  }

  /**
   * Gets a function from the module.
   * @public
   * @param {Symbol} functionType - The type of the function.
   * @returns {function} - The function.
   * @throws {TypeError} - If functionType is not a symbol.
   * @throws {Error} - If functionType is not registered.
   */
  getFunction(functionType) {
    if (typeof functionType !== 'symbol') {
      throw new TypeError('functionType must be a symbol');
    }

    if (!this.moduleFunctions.has(functionType)) {
      throw new Error('functionType is not registered');
    }

    return this.moduleFunctions.get(functionType);
  }
}

export default HazelModule;

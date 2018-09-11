class CustomError extends Error {
  /**
   *
   * @param message
   * @param status
   * @constructor
   */
  constructor(message, status) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.status = status || 500;
  }
}

module.exports = CustomError;

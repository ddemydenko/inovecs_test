class CustomError extends Error {
  /**
   *
   * @param message
   * @param status
   * @param errors
   * @param parameters
   * @constructor
   */
  constructor(message, status, errors, parameters) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.status = status || 500;
    if (errors) this.errors = errors;
    if (parameters) this.parameters = parameters;
  }
}

module.exports = CustomError;

class ValidationError extends Error {
  constructor(errorMessage) {
    super(errorMessage);
    this.statusCode = 400;
  }
}

module.exports = ValidationError;

class ConflictError extends Error {
  constructor(errorMessage) {
    super(errorMessage);
    this.statusCode = 409;
  }
}

module.exports = ConflictError;

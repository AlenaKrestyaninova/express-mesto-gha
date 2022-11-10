class NotAllowedError extends Error {
  constructor(errorMessage) {
    super(errorMessage);
    this.statusCode = 403;
  }
}

module.exports = NotAllowedError;

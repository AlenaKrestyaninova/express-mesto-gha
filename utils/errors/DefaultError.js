class NotFoundError extends Error {
  constructor(errorMessage) {
    super(errorMessage);
    this.statusCode = 500;
  }
}

module.exports = NotFoundError;

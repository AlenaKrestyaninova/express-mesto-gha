class NotFoundError extends Error {
  constructor(errorMessage) {
    super(errorMessage);
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;

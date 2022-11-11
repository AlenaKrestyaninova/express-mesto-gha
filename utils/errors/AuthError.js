class AuthError extends Error {
  constructor(errorMessage) {
    super(errorMessage);
    this.statusCode = 401;
  }
}

module.exports = AuthError;

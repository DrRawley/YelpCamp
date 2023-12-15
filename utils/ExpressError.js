class ExpressError extends Error {
    constructor(message, statusCode, id = null) {
        super();
        this.message = message;
        this.statusCode = statusCode;

    }
}

module.exports = ExpressError;
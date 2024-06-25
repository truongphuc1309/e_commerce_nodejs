'use strict';
const { StatusCodes, ReasonPhrases } = require('../utils/httpStatusCode');

class ErrorResponse extends Error {
    constructor({ type, message = ReasonPhrases[type] }) {
        super(message);
        this.status = StatusCodes[type];
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases['CONFLICT']) {
        super({ type: 'CONFLICT', message });
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases['BAD_REQUEST']) {
        super({ type: 'BAD_REQUEST', message });
    }
}

class UnauthorizedError extends ErrorResponse {
    constructor(message = ReasonPhrases['UNAUTHORIZED']) {
        super({ type: 'UNAUTHORIZED', message });
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message = ReasonPhrases['NOT_FOUND']) {
        super({ type: 'UNAUTHORIZED', message });
    }
}

module.exports = {
    ErrorResponse,
    ConflictRequestError,
    BadRequestError,
    UnauthorizedError,
    NotFoundError,
};

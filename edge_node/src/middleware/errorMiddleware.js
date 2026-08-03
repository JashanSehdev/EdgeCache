import logger from "../services/logger.js";

class ErrorHandler extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleWare = (err, req, res, next) => {
    err.message = err.message || 'Internal Server Error';
    err.statusCode = err.statusCode | 500;

    const errorMessage = err.errors 
    ? Object.values(err.errors)
    .map((error) => error.message)
    .join(" ")
    : err.message;

    logger.error(errorMessage, {
        statusCode: err.statusCode,
        method: req.method,
        url: req.OriginalUrl,
        ip: req.ip,
        stack: err.stack

    })

    return res.status(err.statusCode).json({
        success: false,
        message: 'errorMessage'
    })
}

export default ErrorHandler;
import logger from "../services/logger.js";

class ErrorHandler extends Error {
        constructor(code, message) {
        super(message)
        this.statusCode = code
    }
}

export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || 'Internal Server Error';
    err.statusCode = err.statusCode || 500;

    const errMessage = (err.error) ?
        Object.values(err.message)
        .map((error) => err.message)
        .join(" ")
        : err.message

    logger.error(errMessage, {
        statusCode: err.statusCode,
        method: req.method,
        url: req.OriginalUrl,
        ip: req.ip,
        stack: err.stack

    })

    if (err.statusCode === 404) {
        return res.status(404).json({
        success: false,
        message: 'File Not Found'
    })
    }

    return res.status(err.statusCode).json({
        success: false,
        message: errMessage
    })
}

export default ErrorHandler;
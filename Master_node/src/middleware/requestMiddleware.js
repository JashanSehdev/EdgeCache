// middleware/requestLogger.js

import logger from "../services/logger.js";

export default function requestLogger(req, res, next) {
    const start = Date.now();

    res.on("finish", () => {
        logger.http("HTTP Request", {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            IP_address: req.ip,
            responseTime: `${Date.now() - start}ms`
        });
    });

    next();
}
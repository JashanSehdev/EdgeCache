import { createLogger, format, transports, addColors } from 'winston';

const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        cache: 3,
        http: 4,
        verbose: 5,
        debug: 6,
        silly: 7
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        http: 'magenta',
        cache: 'blue',
        verbose: 'cyan',
        debug: 'white',
        silly: 'grey'
    }
};

addColors(customLevels.colors);

function serializeValue(value) {
    if (value instanceof Error) {
        return {
            message: value.message,
            stack: value.stack,
            name: value.name
        };
    }

    if (value && typeof value === 'object') {
        return Object.entries(value).reduce((acc, [key, item]) => {
            acc[key] = serializeValue(item);
            return acc;
        }, {});
    }

    return value;
}

export function normalizeMeta(meta = {}) {
    const normalized = {};

    Object.entries(meta).forEach(([key, value]) => {
        normalized[key] = serializeValue(value);
    });

    return normalized;
}

const consoleFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf((info) => {
        const meta = normalizeMeta(info);
        const { timestamp, level, message, ...rest } = meta;
        const metadata = Object.keys(rest).length ? ` ${JSON.stringify(rest)}` : '';

        return `${timestamp} ${level}: ${message}${metadata}`;
    }),
    format.colorize({ all: true })
);

const fileFormat = format.combine(
    format.timestamp(),
    format.json()
);

const logger = createLogger({
    levels: customLevels.levels,
    level: 'cache',
    transports: [
        new transports.Console({ format: consoleFormat }),
        new transports.File({
            filename: 'logs/app.log',
            format: fileFormat
        }),
        new transports.File({
            filename: 'logs/app-request.logs',
            level: 'http',
            format: format.combine(
                format((info) => (info.level === 'http' ? info : false))(),
                fileFormat
            )
        })
    ]
});

export default logger;
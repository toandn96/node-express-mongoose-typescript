import winston from 'winston';
import isEmpty from 'lodash.isempty';
import config from '../../config/config';

const customPrintf = winston.format.printf((info) => {
  const { level, message, label, timestamp } = info;
  if (timestamp && label && level && message) {
    return `${timestamp} [${label}] ${level.toLocaleUpperCase()}: ${message}`;
  }
  if (!timestamp && label && level && message) {
    return `[${label}] ${level.toLocaleUpperCase()}: ${message}`;
  }
  const logData: { level?: string; message?: string } = { ...info };
  if (logData.level) delete logData.level;
  if (logData.message) delete logData.message;
  const logDataString = !isEmpty(logData) ? ` - ${JSON.stringify(logData)}` : '';
  return `${level.toLocaleUpperCase()}: ${message}${logDataString}`;
});

// // Ignore log messages if they have { private: true }
const ignorePrivate = winston.format((info) => {
  if (info['private']) {
    return false;
  }
  return info;
});

const combinedFormat = winston.format.combine(customPrintf, winston.format.splat(), winston.format.ms());
const transportCombinedFile = winston.format.combine(
  customPrintf,
  ignorePrivate(),
  winston.format.splat(),
  winston.format.ms()
);

const createLoggerTransports = () => {
  if (config.env === 'production') {
    return [
      new winston.transports.Console({
        stderrLevels: ['error', 'info'],
      }),
      new winston.transports.File({
        filename: 'error.log',
        level: 'error',
        format: transportCombinedFile,
        maxsize: 5242880, // 5MB
      }),
      new winston.transports.File({
        filename: 'combined.log',
        format: transportCombinedFile,
        maxsize: 5242880, // 5MB
      }),
    ];
  }
  return [
    new winston.transports.Console({
      stderrLevels: ['error', 'info'],
    }),
  ];
};

const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: combinedFormat,
  transports: createLoggerTransports(),
});

export default logger;

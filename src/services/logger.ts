enum LogLevel {
  ERROR = "error",
  WARN = "warn",
  DEBUG = "debug",
  INFO = "info"
}

const validateLogLevel = (logLevel = ""): LogLevel => {
  const formattedLogLevel = logLevel.toUpperCase();

  if (LogLevel[formattedLogLevel]) {
    return LogLevel[formattedLogLevel];
  }

  return LogLevel.ERROR;
};

const LOG_LEVEL = validateLogLevel(process.env.LOG_LEVEL);

const logLevels: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  debug: 2,
  info: 4
};

type Logger = (...args: any) => void;

const logger = (logLevel: LogLevel): Logger => (...args) => {
  if (logLevels[logLevel] <= logLevels[LOG_LEVEL]) {
    console[logLevel](...args);
  }
};

const log: Record<LogLevel, Logger> = {
  error: logger(LogLevel.ERROR),
  warn: logger(LogLevel.WARN),
  debug: logger(LogLevel.DEBUG),
  info: logger(LogLevel.INFO)
};

export { log };

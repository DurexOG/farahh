const winston = require("winston");
const chalk = require("chalk");

/**
 * Colorize winston levels for console.
 */
const levelColors = {
  error: chalk.redBright,
  warn: chalk.yellowBright,
  info: chalk.magentaBright,
  debug: chalk.cyanBright
};

/**
 * @typedef {object} LoggerOptions
 * @property {string} botName
 */

/**
 * Production logger using Winston with colorful console output.
 */
class Logger {
  /**
   * @param {LoggerOptions} options
   */
  constructor(options = {}) {
    const botName = options.botName || "Farah";

    this._logger = winston.createLogger({
      level: process.env.LOG_LEVEL || "info",
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(({ timestamp, level, message }) => {
          const color = levelColors[level] || ((x) => x);
          const prefix = color(`[${level.toUpperCase()}]`);
          return `${chalk.gray(timestamp)} ${prefix} ${chalk.white(message)}`;
        })
      ),
      transports: [
        new winston.transports.Console({
          stderrLevels: ["error"]
        })
      ]
    });

    this.botName = botName;
  }

  info(message) {
    this._logger.info(message);
  }

  warn(message) {
    this._logger.warn(message);
  }

  error(message) {
    this._logger.error(message);
  }

  debug(message) {
    this._logger.debug(message);
  }
}

module.exports = { Logger };


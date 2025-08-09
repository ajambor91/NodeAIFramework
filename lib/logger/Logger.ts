import { Service } from '../di/di';

enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
  CRITICAL,
}

const colors = {
  [LogLevel.DEBUG]: '\x1b[37m', // white
  [LogLevel.INFO]: '\x1b[34m', // blue
  [LogLevel.WARN]: '\x1b[33m', // yellow
  [LogLevel.ERROR]: '\x1b[38;5;208m', // orange
  [LogLevel.CRITICAL]: '\x1b[31m', // red
  reset: '\x1b[0m',
};

/**
 * @class Logger
 * @description A singleton logger class.
 */
@Service()
export class Logger {
  private static instance: Logger;

  private constructor() {}

  /**
   * @method getInstance
   * @description Gets the singleton instance of the logger.
   * @returns {Logger} The logger instance.
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * @method log
   * @description Logs a message with a given log level.
   * @param {LogLevel} level - The log level.
   * @param {string} message - The message to log.
   * @param {any[]} args - Additional arguments to log.
   */
  private log(level: LogLevel, message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString();
    const levelString = LogLevel[level];
    const color = colors[level];
    console.log(`${color}[${timestamp}] [${levelString}] ${message}${colors.reset}`, ...args);
  }

  /**
   * @method debug
   * @description Logs a debug message.
   * @param {string} message - The message to log.
   * @param {any[]} args - Additional arguments to log.
   */
  public debug(message: string, ...args: any[]): void {
    this.log(LogLevel.DEBUG, message, ...args);
  }

  /**
   * @method info
   * @description Logs an info message.
   * @param {string} message - The message to log.
   * @param {any[]} args - Additional arguments to log.
   */
  public info(message: string, ...args: any[]): void {
    this.log(LogLevel.INFO, message, ...args);
  }

  /**
   * @method warn
   * @description Logs a warning message.
   * @param {string} message - The message to log.
   * @param {any[]} args - Additional arguments to log.
   */
  public warn(message: string, ...args: any[]): void {
    this.log(LogLevel.WARN, message, ...args);
  }

  /**
   * @method error
   * @description Logs an error message.
   * @param {string} message - The message to log.
   * @param {any[]} args - Additional arguments to log.
   */
  public error(message: string, ...args: any[]): void {
    this.log(LogLevel.ERROR, message, ...args);
  }

  /**
   * @method critical
   * @description Logs a critical message.
   * @param {string} message - The message to log.
   * @param {any[]} args - Additional arguments to log.
   */
  public critical(message: string, ...args: any[]): void {
    this.log(LogLevel.CRITICAL, message, ...args);
  }
}
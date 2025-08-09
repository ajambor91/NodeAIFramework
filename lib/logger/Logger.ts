import { Service } from '../di/di';
import { Writer } from './Writer';

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
 * @description A singleton logger class that provides methods for logging messages at different levels.
 * It uses a Writer instance to write logs to files.
 */
@Service()
export class Logger {
  private static instance: Logger;
  private writer: Writer;

  /**
   * @constructor
   * @private
   * @param {Writer} writer - An instance of the Writer class for log file operations.
   */
  private constructor(writer: Writer) {
    this.writer = writer;
  }

  /**
   * @method getInstance
   * @description Gets the singleton instance of the logger. If an instance doesn't exist, it creates one with a new Writer.
   * @returns {Logger} The singleton logger instance.
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      const writer = new Writer();
      Logger.instance = new Logger(writer);
    }
    return Logger.instance;
  }

  /**
   * @method log
   * @private
   * @description Logs a message to the console and a file with a given log level.
   * If an argument is an Error, its stack trace is logged.
   * @param {LogLevel} level - The log level (e.g., DEBUG, INFO, ERROR).
   * @param {string} message - The main message to log.
   * @param {any[]} args - Additional arguments to log, including Error objects.
   */
  private log(level: LogLevel, message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString();
    const levelString = LogLevel[level];
    const color = colors[level];
    const logMessage = `[${timestamp}] [${levelString}] ${message}`;

    let fileMessage = `${logMessage}`;
    const consoleArgs = [];

    for (const arg of args) {
      if (arg instanceof Error) {
        fileMessage += ` ${arg.stack || arg.message}`;
        consoleArgs.push(arg.stack || arg.message);
      } else {
        fileMessage += ` ${JSON.stringify(arg)}`;
        consoleArgs.push(arg);
      }
    }

    console.log(`${color}${logMessage}${colors.reset}`, ...consoleArgs);
    this.writer.write(fileMessage);
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
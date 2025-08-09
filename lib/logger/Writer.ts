import * as fs from 'fs';
import * as path from 'path';

/**
 * @class Writer
 * @description Handles writing log messages to files.
 */
export class Writer {
    private logDirectory: string;

    /**
     * @constructor
     * @description Initializes the Writer by ensuring the log directory exists.
     */
    constructor() {
        const logsDir = path.join(process.cwd(), 'logs');
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }
        this.logDirectory = logsDir;
    }

    /**
     * @method getLogFilePath
     * @private
     * @description Generates the path for the current day's log file.
     * @returns {string} The absolute path to the log file.
     */
    private getLogFilePath(): string {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return path.join(this.logDirectory, `${year}-${month}-${day}.log`);
    }

    /**
     * @method write
     * @description Writes a message to the daily log file.
     * @param {string} message - The log message to write.
     */
    public write(message: string): void {
        const logFilePath = this.getLogFilePath();
        const timestamp = new Date().toISOString();
        const logMessage = `${timestamp} - ${message}\n`;

        try {
            fs.appendFileSync(logFilePath, logMessage);
        } catch (err) {
            console.error('Failed to write to log file:', err);
        }
    }
}
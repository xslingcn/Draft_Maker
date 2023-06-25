import pino from 'pino';
import { Env } from '../env';

/**
 * Factory for creating a logger with repect to the environmental variables: TEST and DEBUG.
 * 
 * If TEST is set (upon testing), the logger's level is set to 'error'. 
 * If DEBUG is set (upon debugging), the logger's level is set to 'debug'.
 * Otherwise (normal running environment), the logger's level is set to 'info'.
 * 
 * The logger instance is kept singleton, i.e. the class should be instantiated only once and not
 * be used outside this file except for testing.
 * 
 * @class
 * @property {pino.Logger} _logger the logger instance
 */
class LoggerFactory {
    // AF: object = _logger
    // RI: the logger's level is "error" if Env.TEST is true, "debug" if Env.DEBUG is true, and "info" otherwise.
    // Note that later changes to env variables will not affect the logger's level after initialization.
    private _logger: pino.Logger;

    /**
     * Constructs a LoggerFactory instance and initializes a logger with a specific log level.
     * 
     * If TEST is set (upon testing), the logger's level is set to 'error'. 
     * If DEBUG is set (upon debugging), the logger's level is set to 'debug'.
     * Otherwise (normal running environment), the logger's level is set to 'info'.
     * 
     * @constructor
     */
    constructor() {
        this._logger = pino({ level: Env.TEST ? "error" : (Env.DEBUG ? "debug" : "info") });
    }

    /**
     * Gets the logger instance.
     * 
     * @returns {pino.Logger} The logger instance
     */
    public get logger(): pino.Logger {
        return this._logger;
    }
}

const logger = new LoggerFactory().logger;
export default logger;
/**
 * Logger utility using Pino
 */
import pino from 'pino';

export class Logger {
  private static instance: pino.Logger;

  static getInstance(): pino.Logger {
    if (!Logger.instance) {
      Logger.instance = pino({
        level: process.env.LOG_LEVEL || 'info',
        // transport: {
        //   target: 'pino-pretty',
        //   options: {
        //     colorize: true,
        //     translateTime: 'SYS:standard',
        //     ignore: 'pid,hostname',
        //   },
        // },
      });
    }
    return Logger.instance;
  }

  static getLogger(module: string): pino.Logger {
    return Logger.getInstance().child({ module });
  }

  static info(message: string, data?: any): void {
    Logger.getInstance().info(data || {}, message);
  }

  static error(message: string, error?: any): void {
    Logger.getInstance().error(error || {}, message);
  }

  static warn(message: string, data?: any): void {
    Logger.getInstance().warn(data || {}, message);
  }

  static debug(message: string, data?: any): void {
    Logger.getInstance().debug(data || {}, message);
  }
}

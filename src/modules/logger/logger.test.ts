import winston from 'winston';
import { transformableInfo } from './logger';

describe('logger setup', () => {
  describe('Configuration', () => {
    let logger: winston.Logger;
    beforeAll(() => {
      logger = winston.createLogger({
        transports: [new winston.transports.Console()],
      });
    });
    it('configure', () => {
      expect(logger.transports.length).toEqual(1);
    });
  });
  describe('TransformableInfo function', () => {
    it('log message info with all props', () => {
      const info = {
        level: 'info',
        message: 'Test message',
        label: 'LABEL',
        timestamp: 123,
      };
      expect(transformableInfo({ ...info })).toEqual(
        `${info.timestamp} [${info.label}] ${info.level.toLocaleUpperCase()}: ${info.message}`
      );
    });
    it('log message info with missing label props', () => {
      const info = {
        level: 'info',
        message: 'Test message',
        label: '',
        timestamp: 123,
      };
      const logData: { level?: string; message?: string } = { ...info };
      if (logData.level) delete logData.level;
      if (logData.message) delete logData.message;
      const logDataString = Object.keys(logData).length ? ` - ${JSON.stringify(logData)}` : '';
      expect(transformableInfo({ ...info })).toEqual(`${info.level.toLocaleUpperCase()}: ${info.message}${logDataString}`);
    });

    it('log message info with missing timestamp props', () => {
      const info = {
        level: 'info',
        message: 'Test message',
        label: 'Test',
      };
      expect(transformableInfo({ ...info })).toEqual(`[${info.label}] ${info.level.toLocaleUpperCase()}: ${info.message}`);
    });
  });
});

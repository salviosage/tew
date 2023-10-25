import { createLogger, format, transports } from 'winston';

import configuration from '@src/config/configuration';

export const loggerFactory = () => {
  const { logLevel } = configuration();

  const logger = createLogger({
    level: logLevel,
    format: format?.json(),
    defaultMeta: { product: 'tew' },
  });

  // Console transport logging debug and above.
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  );
  return logger;
};

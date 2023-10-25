import { Module } from '@nestjs/common';

import { LOGGER } from '@src/constant';
import { loggerFactory } from './logger.service';

@Module({
  providers: [
    {
      provide: LOGGER,
      useFactory: loggerFactory,
    },
  ],
  exports: [LOGGER],
})
export class LoggerModule {}

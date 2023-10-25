import { CronExpression } from '@nestjs/schedule';

export const CronExpressionExt = {
  ...CronExpression,
  EVERY_20_MINS_AFTER_4_HOURS: '20 0-23/4 * * *',
};

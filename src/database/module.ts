import { Module } from '@nestjs/common';
import { DatabaseOptionsService } from './service';

@Module({
  providers: [DatabaseOptionsService],
  exports: [DatabaseOptionsService],
  imports: [],
  controllers: [],
})
export class DatabaseOptionsModule {}

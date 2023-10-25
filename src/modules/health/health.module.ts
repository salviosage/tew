import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthPublicController } from './health.public.controller';

@Module({
  providers: [],
  exports: [],
  controllers: [HealthPublicController],
  imports: [TerminusModule],
})
export class HealthModule {}

import { Module } from '@nestjs/common';
import { UtilityService } from './util';
import { ResponseService } from './services/response.service';
import { PaginationService } from './services/pagination.service';

@Module({
  imports: [],
  providers: [PaginationService, UtilityService, ResponseService],
  controllers: [],
  exports: [PaginationService, UtilityService, ResponseService],
})
export class SharedModule {}

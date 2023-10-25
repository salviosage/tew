import { Controller, Get, Res, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { ResponseService } from '@src/shared/services/response.service';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { DB_CONNECTION } from '@src/constant';

@ApiTags('health')
@Controller({
  version: VERSION_NEUTRAL,
  path: '/public/health',
})
export class HealthPublicController {
  constructor(
    private responseService: ResponseService,
    private readonly health: HealthCheckService,
    private readonly memoryHealthIndicator: MemoryHealthIndicator,
    private readonly diskHealthIndicator: DiskHealthIndicator,
    private db: TypeOrmHealthIndicator,
    @InjectConnection(DB_CONNECTION)
    private mainConnection: Connection,
  ) {}

  @Get('/database')
  async checkDatabase(@Res() res: Response): Promise<any> {
    const data = await this.health.check([
      () =>
        this.db.pingCheck('albums-database', {
          connection: this.mainConnection,
        }),
    ]);

    return this.responseService.json(
      res,
      200,
      'successfully database health check',
      data,
    );
  }
  @HealthCheck()
  @Get('/memory-heap')
  async checkMemoryHeap(@Res() res: Response): Promise<any> {
    const data = await this.health.check([
      () =>
        this.memoryHealthIndicator.checkHeap('memoryHeap', 300 * 1024 * 1024),
    ]);

    return this.responseService.json(
      res,
      200,
      'successfully memory heap health check',
      data,
    );
  }

  @HealthCheck()
  @Get('/memory-rss')
  async checkMemoryRss(@Res() res: Response): Promise<any> {
    const data = await this.health.check([
      () => this.memoryHealthIndicator.checkRSS('memoryRss', 300 * 1024 * 1024),
    ]);

    return this.responseService.json(
      res,
      200,
      'successfully memory rss health check',
      data,
    );
  }

  @HealthCheck()
  @Get('/storage')
  async checkStorage(@Res() res: Response): Promise<any> {
    const data = await this.health.check([
      () =>
        this.diskHealthIndicator.checkStorage('diskHealth', {
          thresholdPercent: 0.75,
          path: '/',
        }),
    ]);

    return this.responseService.json(
      res,
      200,
      'successfully storage health check',
      data,
    );
  }
}

import { Controller, Get, Inject, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { LOGGER } from '@src/constant';
import { ResponseService } from './shared/services/response.service';
import { Logger } from 'winston';
import { Response } from 'express';

@Controller({ path: '', version: '1' })
export class AppController {
  private logger: Logger;
  constructor(
    @Inject(LOGGER) logger: Logger,
    private responseService: ResponseService,
    private readonly appService: AppService,
  ) {
    this.logger = logger.child({
      context: { service: 'AppController', module: 'App' },
    });
  }

  @Get('/hello')
  sayHello(@Res() res: Response) {
    return this.responseService.json(res, 200, 'TEW API running');
  }
}

import { Controller, Inject } from '@nestjs/common';
import { Logger } from 'winston';
import { UserService } from '../user.service';
import { ResponseService } from '@src/shared/services/response.service';
import { LOGGER } from '@src/constant';

@Controller({ path: 'users', version: '1' })
export class UserController {
  private logger: Logger;
  constructor(
    @Inject(LOGGER) logger: Logger,
    private readonly userService: UserService,
    private responseService: ResponseService,
  ) {
    this.logger = logger.child({
      context: { service: 'UserController', module: 'User' },
    });
  }
}

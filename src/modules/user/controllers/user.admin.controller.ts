import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Logger } from 'winston';
import { JWTAuthGuard } from '@src/auth/guards/jwt-auth.guard';
import RolesGuard from '@src/auth/guards/role.guard';
import { Roles } from '@src/shared/decorators/role.decorator';
import { UserService } from '../user.service';
import { Response } from 'express';
import { ResponseService } from '@src/shared/services/response.service';
import { LOGGER, STATUS_CODE_ENUM } from '@src/constant';
import { ENUM_ROLE_TYPE } from '../interfaces';
import { CreateUserDTO } from '@src/auth/dtos';
import { findAllUserDto } from '../user.dtos';

@Controller({ path: 'admin/users', version: '1' })
export class UserAdminController {
  private logger: Logger;
  constructor(
    @Inject(LOGGER) logger: Logger,
    private readonly userService: UserService,
    private responseService: ResponseService,
  ) {
    this.logger = logger.child({
      context: { service: 'UserAdminController', module: 'User' },
    });
  }

  @Roles(ENUM_ROLE_TYPE.ADMIN, ENUM_ROLE_TYPE.SUPER_ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Get('/')
  async listUsers(@Res() res: Response, @Query() params: findAllUserDto) {
    const { page, limit, all, select, relations, ...search } = params;
    const s = select?.split(',').filter((item) => item.length > 0);
    const r = relations?.split(',').filter((item) => item.length > 0);
    try {
      const payload = await this.userService.findAll(
        { page, limit, all },
        search,
        r,
        s,
        undefined,
        this.logger,
      );
      return this.responseService.json(
        res,
        STATUS_CODE_ENUM.OK,
        'users list',
        payload,
      );
    } catch (err) {
      this.logger.error(`${err.message}`);
      return this.responseService.json(res, err);
    }
  }
  @Roles(ENUM_ROLE_TYPE.ADMIN, ENUM_ROLE_TYPE.SUPER_ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Post('/')
  async createUser(@Res() res: Response, @Body() payload: CreateUserDTO) {
    try {
      await this.userService.createUser(payload, this.logger);
      return this.responseService.json(
        res,
        STATUS_CODE_ENUM.CREATED,
        'Successfully user created',
      );
    } catch (err) {
      this.logger.error(`${err.message}`);
      return this.responseService.json(res, err);
    }
  }
}

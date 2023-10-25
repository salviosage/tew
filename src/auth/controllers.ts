import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Logger } from 'winston';
import { AuthenticationService } from '@src/auth/services';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JWTAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators';
import { CheckUserDto, SignupDTO } from './dtos';
import { Response } from 'express';
import { UserEntity } from '@src/modules/user/entity/user.entity';
import { ResponseService } from '@src/shared/services/response.service';
import { LOGGER } from '@src/constant';

@Controller({ path: 'auth', version: '1' })
export class AuthenticationController {
  private logger: Logger;
  constructor(
    @Inject(LOGGER) logger: Logger,
    private readonly authenticationService: AuthenticationService,
    private responseService: ResponseService,
  ) {
    this.logger = logger.child({
      context: { service: 'AuthController', module: 'Auth' },
    });
  }

  @Post('/signup')
  async signup(@Res() res: Response, @Body() payload: SignupDTO) {
    await this.authenticationService.signUp(payload, this.logger);
    return this.responseService.json(res, 200, 'Successfully user created');
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: UserEntity,
    @Res() res: Response,
  ): Promise<any> {
    const response = await this.authenticationService.login(user, this.logger);
    return this.responseService.json(
      res,
      200,
      'Logged in successfully',
      response,
    );
  }

  @Get('/me')
  @UseGuards(JWTAuthGuard)
  async getMeUser(@Res() res: Response, @CurrentUser() user: UserEntity) {
    const me = await this.authenticationService.me(user);
    return this.responseService.json(
      res,
      200,
      'User Profile fetched successfully',
      me,
    );
  }

  @Get('/check-user')
  async checkUser(@Res() res: Response, @Body() payload: CheckUserDto) {
    const response = await this.authenticationService.checkUser(payload);
    return this.responseService.json(
      res,
      200,
      'Successfully checked user',
      response,
    );
  }
}

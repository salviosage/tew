import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JWT_STRATEGY, LOCAL_STRATEGY } from '@src/constant';
import { CheckUserDto, SignupDTO, ValidateUserDTO } from './dtos';
import { UserService } from '@src/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { UserEntity } from '@src/modules/user/entity/user.entity';
import { Logger } from 'winston';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  me(user: UserEntity) {
    // exlude sesntive data
    delete user.password;
    return user;
  }

  async signUp(payload: SignupDTO, logger: Logger) {
    logger.info(`creating user ${payload.email}`);
    const email = payload.email?.toLowerCase()?.trim();
    const [emailExists] = await Promise.all([
      this.userService.checkEmail(email),
    ]);
    if (emailExists) {
      throw new BadRequestException('email already exists');
    }
    const pwd = await bcrypt.hash(payload.password, 10);

    const user = await this.userService.create({
      ...payload,
      password: pwd,
      isActive: true,
    });

    logger.info(`user created successfully ${user.id}`);
    return await this._authorizeUser(user);
  }

  async login(user: UserEntity, logger: Logger) {
    logger.info(`logging in user ${user.id}`);
    this.userService.update({ id: user.id }, { lastLoggedIn: new Date() });
    return this._authorizeUser(user);
  }

  async validateUser(payload: ValidateUserDTO) {
    try {
      const { email, password, id, strategy } = payload;
      let query = { id } as any;

      if (strategy === LOCAL_STRATEGY) {
        query = { email: email.toLowerCase().trim() };
      }

      const user = await this.userService.findOneUser(query);

      if (!user) {
        throw new UnauthorizedException('Invalid Login Credentials.');
      }

      // JWT strategy only validates user by ID and returns the user document
      if (strategy === JWT_STRATEGY) {
        return user;
      }

      const passwordMatches = await bcrypt.compare(password, user.password);
      if (passwordMatches) {
        return user;
      }

      throw new UnauthorizedException('Invalid login credentials.');
    } catch (error) {
      if (error.response?.status === 400) {
        throw new UnauthorizedException(
          'Invalid login details, please enter the correct details.',
        );
      }
      throw error;
    }
  }

  private async _authorizeUser(user: UserEntity): Promise<any> {
    return {
      token: this.jwtService.sign({
        id: user.id,
      }),
    };
  }

  async checkUser({ email }: CheckUserDto) {
    if (!email) {
      throw new BadRequestException('email is required');
    }
    const [emailExists] = await Promise.all([
      email ? this.userService.checkEmail(email.toLowerCase().trim()) : false,
    ]);
    return {
      email: emailExists,
      userExist: emailExists,
    };
  }
}

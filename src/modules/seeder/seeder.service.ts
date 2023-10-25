import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { ENUM_ROLE_TYPE } from '../user/interfaces';
import { CreateUserDTO } from '@src/auth/dtos';
import { Logger } from 'winston';
import { LOGGER } from '@src/constant';

@Injectable()
export class SeederService {
  private readonly password: string;
  private readonly seedEmail: string;
  private logger: Logger;
  constructor(
    @Inject(LOGGER) logger: Logger,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    this.seedEmail = this.configService.get<string>('seed.email');
    this.password = this.configService.get<string>('seed.password');
    this.logger = logger.child({
      context: { service: 'SeedService', module: 'Seed' },
    });
  }

  async seedUser(): Promise<any> {
    const users: CreateUserDTO[] = [
      {
        firstName: 'Admin',
        lastName: 'User',
        email: `super.${this.seedEmail}`,
        password: this.password,
        roles: [ENUM_ROLE_TYPE.SUPER_ADMIN],
      },
      {
        firstName: 'admin',
        password: this.password,
        lastName: 'test',
        email: `admin.${this.seedEmail}`,
        roles: [ENUM_ROLE_TYPE.ADMIN],
      },
      {
        firstName: 'user',
        lastName: 'test',
        email: `user.${this.seedEmail}`,
        password: this.password,
        roles: [ENUM_ROLE_TYPE.USER],
      },
    ];

    try {
      await this.userService.createOrUpdateUsers(users, this.logger);
    } catch (err: any) {
      throw new Error(err.message);
    }

    return;
  }
}

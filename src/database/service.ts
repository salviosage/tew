import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ENUM_APP_ENVIRONMENT } from '@src/constant';
import { readFileSync } from 'fs';

@Injectable()
export class DatabaseOptionsService {
  constructor(private readonly configService: ConfigService) {}

  createOptions(): TypeOrmModuleOptions {
    const env = this.configService.get<string>('env');
    const typeormOptions: TypeOrmModuleOptions = {
      type: 'postgres',
      host: this.configService.get<string>('database.host'),
      port: +this.configService.get<number>('database.port'),
      username: this.configService.get<string>('database.user'),
      password: this.configService.get<string>('database.password'),
      database: this.configService.get<string>('database.name'),
      logging: env !== ENUM_APP_ENVIRONMENT.PRODUCTION ? false : false,
      retryDelay: 5000,
      keepConnectionAlive:
        env !== ENUM_APP_ENVIRONMENT.PRODUCTION ? false : true,
      synchronize: env !== ENUM_APP_ENVIRONMENT.PRODUCTION ? true : false,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      ssl:
        env !== ENUM_APP_ENVIRONMENT.DEVELOPMENT
          ? {
              ca: readFileSync('/code/database_ssl.pem').toString(),
            }
          : false,
    };
    return typeormOptions;
  }
}

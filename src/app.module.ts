import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import configuration from '@src/config/configuration';
import { AuthModule } from '@src/auth/module';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederModule } from './modules/seeder/seeder.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from './shared/logger/logger.module';
import { SharedModule } from './shared/shared.module';
import { DB_CONNECTION } from './constant';
import { DatabaseOptionsService } from './database/service';
import { DatabaseOptionsModule } from './database/module';
import { HealthModule } from './modules/health/health.module';
import { WalletModule } from './modules/wallet/wallet.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: configuration().isTest() ? '.env.test' : '.env',
    }),
    TypeOrmModule.forRootAsync({
      name: DB_CONNECTION,
      imports: [DatabaseOptionsModule],
      inject: [DatabaseOptionsService],
      useFactory: async (databaseOptionsService: DatabaseOptionsService) =>
        databaseOptionsService.createOptions(),
    }),
    {
      module: LoggerModule,
      global: true,
    },
    {
      module: SharedModule,
      global: true,
    },
    {
      module: HealthModule,
      global: true,
    },
    AuthModule,
    UserModule,
    WalletModule,
    SeederModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

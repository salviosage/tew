// Package imports
import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { DB_CONNECTION } from '@src/constant';
import { UserAdminController } from './controllers/user.admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity], DB_CONNECTION)],
  controllers: [UserController, UserAdminController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

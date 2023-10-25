import { PickType } from '@nestjs/swagger';
import { UserEntity } from '@src/modules/user/entity/user.entity';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignupDTO extends PickType(UserEntity, [
  'email',
  'firstName',
  'lastName',
  'password',
  'country',
  'gender',
  'dob',
]) {}

export class CreateUserDTO extends PickType(UserEntity, [
  'email',
  'firstName',
  'lastName',
  'roles',
  'password',
  'country',
  'gender',
]) {}

export class ValidateUserDTO {
  @IsString()
  @IsNotEmpty()
  id?: string;

  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @IsString()
  @IsNotEmpty()
  password?: string;

  @IsString()
  @IsNotEmpty()
  strategy: string;
}

export class CheckUserDto {
  @IsEmail()
  @IsOptional()
  @Type(() => String)
  email: string;
}

export type IAuthorizeUser = UserEntity & { token: string };

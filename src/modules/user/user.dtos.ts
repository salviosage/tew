import { IntersectionType, PartialType } from '@nestjs/swagger';
import { SignupDTO } from '@src/auth/dtos';
import { IsOptional } from 'class-validator';
import { PaginateDTO } from '@src/shared/types';

export class findAllUserDto extends IntersectionType(
  PartialType(SignupDTO),
  PaginateDTO,
) {
  @IsOptional()
  relations?: string;

  @IsOptional()
  select?: string;
}

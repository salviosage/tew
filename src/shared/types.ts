import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';


export enum NumberFormatStyleOptions {
  Currency = 'currency',
  Decimal = 'decimal',
  Percent = 'percent',
  Unit = 'unit',
  Compact = 'compact',
}

export class PaginateDTO {
  
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page = 1;

  
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit = 10;

  @IsBoolean()
  @IsOptional()
  all?: boolean;
}





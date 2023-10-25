// Package imports
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Entity, Column, Index, OneToMany } from 'typeorm';
import { USERS } from '@src/constant/tables';
import { BaseEntity } from '@src/database/abstract';
import { ENUM_ROLE_TYPE, GENDER_ENUM } from '../interfaces';
import { WalletEntity } from '@src/modules/wallet/entity/wallet.entity';
import { TransactionEntity } from '@src/modules/wallet/entity/transactions.entity';

@Entity(USERS)
export class UserEntity extends BaseEntity {
  
  @Index()
  @IsNotEmpty()
  @IsEmail()
  @Column({ unique: true, length: 50, nullable: false })
  email: string;

  
  @Index()
  @IsNotEmpty()
  @IsString()
  @Column({ length: 50 })
  firstName: string;

  
  @IsNotEmpty()
  @IsString()
  @Column({ length: 50 })
  lastName: string;

  
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(ENUM_ROLE_TYPE, { each: true })
  @Index()
  @Column('simple-json', { default: [ENUM_ROLE_TYPE.USER] })
  roles: ENUM_ROLE_TYPE[];

  
  @IsOptional()
  @Column({ length: 100, nullable: true })
  country?: string;

  
  @IsDateString()
  @IsOptional()
  @Column({ type: 'timestamp', nullable: true })
  dob?: Date;



  @IsOptional()
  @IsIn(Object.values(GENDER_ENUM))
  @Column({ length: 50, nullable: true })
  gender?: GENDER_ENUM;

  @IsNotEmpty()
  @IsString()
  @Column({ length: 5000 })
  password: string;

  
  @IsOptional()
  @Index()
  @Column({ default: false })
  isActive: boolean;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  signUpDate: Date;


  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastLoggedIn: Date;

  @IsOptional()
  @Index()
  @Column({ default: false })
  isDeleted: boolean;

  @OneToMany(() => WalletEntity, (wallet) => wallet.user, {
    cascade: ['remove'], // Cascade delete
  })
  wallets: WalletEntity[];

  @OneToMany(() => TransactionEntity, (transaction) => transaction.user, {
    cascade: ['remove'], // Cascade delete
  })
  transactions: TransactionEntity[];


}

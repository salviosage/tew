// Package imports
import { IsIn, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { Entity, Column, ManyToOne, JoinColumn, Index, OneToMany } from 'typeorm';
import { WALLET } from '@src/constant/tables';
import { BaseEntity } from '@src/database/abstract';
import { UserEntity } from '@src/modules/user/entity/user.entity';
import { CURRENCY_ENUM, WALLET_STATUS_ENUM } from '../wallet.interfaces';
import { TransactionEntity } from './transactions.entity';

@Entity(WALLET)
export class WalletEntity extends BaseEntity {

  @IsString()
  @Index()
  @Column('text', { nullable: false })
  name: string;
  
  @IsIn(Object.values(CURRENCY_ENUM))
  @Index()
  @Column({ length: 50, nullable: false , default: CURRENCY_ENUM.RWF})
  currency: CURRENCY_ENUM;

  @IsNumber()
  @IsOptional()
  @Column('float', { default: 0 })
  pendingBalance?: number;

  @IsNumber()
  @IsOptional()
  @Column('float', { default: 0 })
  availableBalance?: number;

  @IsNumber()
  @IsOptional()
  @Column('float', { default: 0 })
  floatBalance?: number;

  @IsNumber()
  @IsOptional()
  @Column('float', { default: 0 })
  ledgerBalance?: number;

  @IsIn(Object.values(WALLET_STATUS_ENUM))
  @Index()
  @Column({ length: 50, nullable: false, default: WALLET_STATUS_ENUM.ACTIVE })
  status: WALLET_STATUS_ENUM;

  @IsOptional()
  @Index()
  @Column({ default: false })
  isDeleted: boolean;

  @ManyToOne(() => UserEntity, (user) => user.wallets, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @IsUUID()
  @IsOptional()
  @Column()
  userId: string;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.wallet, {
    cascade: ['remove'], // Cascade delete
  })
  transactions: TransactionEntity[];
}

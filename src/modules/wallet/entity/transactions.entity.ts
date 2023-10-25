// Package imports
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { TRANSACTIONS } from '@src/constant/tables';
import { BaseEntity } from '@src/database/abstract';
import { UserEntity } from '@src/modules/user/entity/user.entity';
import {
  TRANSACTION_STATUS_ENUM,
  TRANSACTION_TYPE_ENUM,
} from '../wallet.interfaces';
import { WalletEntity } from './wallet.entity';

@Entity(TRANSACTIONS)
export class TransactionEntity extends BaseEntity {
  @IsIn(Object.values(TRANSACTION_TYPE_ENUM))
  @Index()
  @Column({ nullable: false })
  action: TRANSACTION_TYPE_ENUM;

  @IsIn(Object.values(TRANSACTION_STATUS_ENUM))
  @Index()
  @Column({ nullable: false })
  status: TRANSACTION_STATUS_ENUM;

  @IsNumber()
  @Column('float')
  amount: number;

  @IsString()
  @Column('text', { nullable: false })
  description: string;

  @Column('float', { nullable: false })
  walletStateAfter: number;

  @Column('float', { nullable: false })
  walletStateBefore: number;

  @IsString()
  @Column('text', { nullable: false })
  reference: string;

  @Column({ type: 'timestamp', nullable: false })
  transactionDate: Date;

  @ManyToOne(() => UserEntity, (user) => user.transactions, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @IsUUID()
  @IsOptional()
  @Column()
  userId: string;

  @ManyToOne(() => WalletEntity, (wallet) => wallet.transactions, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'walletId' })
  wallet: WalletEntity;

  @IsUUID()
  @IsNotEmpty()
  @Column()
  walletId: string;
}

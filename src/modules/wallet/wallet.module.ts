// Package imports
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_CONNECTION } from '@src/constant';
import { WalletController } from './controllers/wallet.controller';
import { WalletAdminController } from './controllers/wallet.admin.controller';
import { WalletEntity } from './entity/wallet.entity';
import { WalletService } from './wallet.service';
import { TransactionEntity } from './entity/transactions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WalletEntity], DB_CONNECTION),
    TypeOrmModule.forFeature([TransactionEntity], DB_CONNECTION),
  ],
  controllers: [WalletController, WalletAdminController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}

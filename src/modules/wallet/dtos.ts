import {
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { WalletEntity } from '@src/modules/wallet/entity/wallet.entity';
import { PaginateDTO } from '@src/shared/types';
import { IsOptional } from 'class-validator';
import { TransactionEntity } from './entity/transactions.entity';

export class CreateWalletDTO extends PickType(WalletEntity, [
  'currency',
  'name'
]) {
}

export class CreateWalletTransactionDTO extends PickType(TransactionEntity, [
  'action',
  'amount',
  'description',
  'walletId',
]) {
}


class SearchWalletDTO extends PickType(WalletEntity, [
  'userId',
  'name',
  'currency',
]) {}

class SearchTransactionDTO extends PickType(TransactionEntity, [
  'action',
  'amount',
  'reference',
  'walletId',
  'userId'
]) {}

export class FindAllWalletDTO extends IntersectionType(
  PartialType(SearchWalletDTO),
  PaginateDTO,
) {
  @IsOptional()
  relations?: string;
  
  @IsOptional()
  select?: string;
}

export class FindAllTransactionDTO extends IntersectionType(
  PartialType(SearchTransactionDTO),
  PaginateDTO,
) {
  @IsOptional()
  relations?: string;
  
  @IsOptional()
  select?: string;
}

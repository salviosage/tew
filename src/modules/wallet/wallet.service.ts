import { BadRequestException, Injectable } from '@nestjs/common';
import { WalletEntity } from '@src/modules/wallet/entity/wallet.entity';
import {
  DeepPartial,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { DB_CONNECTION } from '@src/constant';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from 'winston';
import { PaginationService } from '@src/shared/services/pagination.service';
import { PaginateDTO } from '@src/shared/types';
import { CreateWalletDTO, CreateWalletTransactionDTO } from './dtos';
import { UserEntity } from '../user/entity/user.entity';
import { UtilityService } from '@src/shared/util';
import * as moment from 'moment';
import { TransactionEntity } from './entity/transactions.entity';
import {
  TRANSACTION_STATUS_ENUM,
  transactionRelations,
  transactionSelectfields,
  walletRelations,
  walletSelectfields,
} from './wallet.interfaces';
const transactionCharge = 0.025;
@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletEntity, DB_CONNECTION)
    private walletRepository: Repository<WalletEntity>,
    @InjectRepository(TransactionEntity, DB_CONNECTION)
    private transactionRepository: Repository<TransactionEntity>,
    private paginationService: PaginationService,
    private utilityService: UtilityService,
  ) {}
  async findAllWallets(
    paginate: PaginateDTO,
    criteria?: FindOptionsWhere<WalletEntity>,
    populate: string[] = undefined,
    filter: string[] = walletSelectfields,
    order: any = undefined,
    logger?: Logger,
  ): Promise<any> {
    logger.info(`finding wallets ${criteria}`);
    const { select, relations } =
      await this.utilityService.checkFiltersAndRelations(
        populate,
        walletRelations,
        filter,
        walletSelectfields,
        logger,
      );
    const { page, limit, all } = paginate;

    return await this.paginationService.paginate<WalletEntity>(
      this.walletRepository,
      criteria,
      page,
      limit,
      this.paginationService.castToBoolean(all),
      relations,
      order,
      select,
    );
  }
  async findAllTransactions(
    paginate: PaginateDTO,
    criteria?: FindOptionsWhere<TransactionEntity>,
    populate: string[] = undefined,
    filter: string[] = transactionSelectfields,
    order: any = undefined,
    logger?: Logger,
  ): Promise<any> {
    logger.info(`finding transactions ${criteria}`);
    const { select, relations } =
      await this.utilityService.checkFiltersAndRelations(
        populate,
        transactionRelations,
        filter,
        transactionSelectfields,
        logger,
      );
    const { page, limit, all } = paginate;

    return await this.paginationService.paginate<TransactionEntity>(
      this.transactionRepository,
      criteria,
      page,
      limit,
      this.paginationService.castToBoolean(all),
      relations,
      order,
      select,
    );
  }

  async count(criteria?: FindOptionsWhere<WalletEntity>): Promise<number> {
    return this.walletRepository.count({
      where: {
        ...criteria,
      },
    });
  }
  async createWallet(
    user: UserEntity,
    payload: CreateWalletDTO,
    logger: Logger,
  ): Promise<WalletEntity> {
    logger.info(`creating wallet ${payload}`);

    const name = payload.name.trim().toLocaleLowerCase();
    const walletExist = await this.count({
      name,
      isDeleted: false,
      userId: user.id,
    });

    if (walletExist) {
      throw new BadRequestException('You already have wallet with same name');
    }

    const wallet = this.walletRepository.create({
      ...payload,
      userId: user.id,
      name,
    });
    return await this.walletRepository.save(wallet);
  }

  async createWalletTransaction(
    user: UserEntity,
    payload: CreateWalletTransactionDTO,
    logger: Logger,
  ): Promise<TransactionEntity> {
    logger.info(`creating wallet transaction  ${payload}`);
    const wallet = await this.findOneWallet({
      id: payload.walletId,
      isDeleted: false,
      userId: user.id,
    });
    if (!wallet) {
      throw new BadRequestException('Wallet not found');
    }
    // check if available balance is enough
    if (
      wallet.availableBalance < payload.amount * transactionCharge &&
      payload.action === 'DEBIT'
    ) {
      throw new BadRequestException('Insufficient funds');
    }
    const transaction = {
      ...payload,
      userId: user.id,
      walletId: wallet.id,
      status: TRANSACTION_STATUS_ENUM.COMPLETED,
      walletStateBefore: wallet.availableBalance,
      walletStateAfter:
        payload.action === 'DEBIT'
          ? wallet.availableBalance - payload.amount
          : wallet.availableBalance + payload.amount,
      reference: await this.utilityService.generateRandomString(10),
      transactionDate: moment().toDate(),
    };
    const response = await this.transactionRepository.save(transaction);

    // update wallet
    wallet.availableBalance = transaction.walletStateAfter;
    await this.walletRepository.save(wallet);

    return response;
  }

  async findOneWallet(
    criteria: FindOptionsWhere<WalletEntity>,
  ): Promise<WalletEntity> {
    return this.walletRepository.findOne({
      where: {
        ...criteria,
      },
    });
  }

  async findOneWalletTransaction(
    criteria: FindOptionsWhere<TransactionEntity>,
  ): Promise<TransactionEntity> {
    return this.transactionRepository.findOne({
      where: {
        ...criteria,
      },
    });
  }
}

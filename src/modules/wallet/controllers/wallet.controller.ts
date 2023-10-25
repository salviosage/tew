import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Logger } from 'winston';
import { CurrentUser } from '@src/auth/decorators';
import { JWTAuthGuard } from '@src/auth/guards/jwt-auth.guard';
import { Response } from 'express';
import { ResponseService } from '@src/shared/services/response.service';
import { LOGGER, STATUS_CODE_ENUM } from '@src/constant';
import {
  CreateWalletDTO,
  CreateWalletTransactionDTO,
  FindAllTransactionDTO,
  FindAllWalletDTO
} from '../dtos';
import { WalletService } from '../wallet.service';
import { UserEntity } from '@src/modules/user/entity/user.entity';

@Controller({ path: 'wallet', version: '1' })
@UseGuards(JWTAuthGuard)
export class WalletController {
  private logger: Logger;
  constructor(
    @Inject(LOGGER) logger: Logger,
    private readonly walletService: WalletService,
    private responseService: ResponseService,
  ) {
    this.logger = logger.child({
      context: { service: 'WalletController', module: 'Wallet' },
    });
  }
  @Get('/')
  async listWallets(
    @Res() res: Response,
    @Query() params: FindAllWalletDTO,
    @CurrentUser() user: UserEntity,
  ) {
    try {
      const { page, limit, all, select, relations, ...search } = params;
      const s = select?.split(',').filter((item) => item.length > 0);
      const r = relations?.split(',').filter((item) => item.length > 0);
      const payload = await this.walletService.findAllWallets(
        { page, limit, all },
        { ...search, userId: user.id },
        r,
        s,
        undefined,
        this.logger,
      );
      return this.responseService.json(
        res,
        STATUS_CODE_ENUM.OK,
        'wallets list',
        payload,
      );
    } catch (err) {
      this.logger.error(`${err.message}`);
      return this.responseService.json(res, err);
    }
  }
  @Get('/transactions')
  async listWalletTransactions(
    @Res() res: Response,
    @Query() params: FindAllTransactionDTO,
    @CurrentUser() user: UserEntity,
  ) {
    try {
      const { page, limit, all, select, relations, ...search } = params;
      const s = select?.split(',').filter((item) => item.length > 0);
      const r = relations?.split(',').filter((item) => item.length > 0);
      const payload = await this.walletService.findAllTransactions(
        { page, limit, all },
        { ...search, userId: user.id },
        r,
        s,
        undefined,
        this.logger,
      );
      return this.responseService.json(
        res,
        STATUS_CODE_ENUM.OK,
        'transactions list',
        payload,
      );
    } catch (err) {
      this.logger.error(`${err.message}`);
      return this.responseService.json(res, err);
    }
  }

  @Post('/')
  async createWallet(
    @Res() res: Response,
    @Body() payload: CreateWalletDTO,
    @CurrentUser() user: UserEntity,
  ) {
    try {
      const data = await this.walletService.createWallet(
        user,
        payload,
        this.logger,
      );
      return this.responseService.json(
        res,
        STATUS_CODE_ENUM.CREATED,
        'Successfully wallet created',
        data,
      );
    } catch (err) {
      this.logger.error(`${err.message}`);
      return this.responseService.json(res, err);
    }
  }

  @Post('/transactions')
  async createWalletTransaction(
    @Res() res: Response,
    @Body() payload: CreateWalletTransactionDTO,
    @CurrentUser() user: UserEntity,
  ) {
    try {
      const data = await this.walletService.createWalletTransaction(
        user,
        payload,
        this.logger,
      );
      return this.responseService.json(
        res,
        STATUS_CODE_ENUM.CREATED,
        'Successfully transaction created',
        data,
      );
    } catch (err) {
      this.logger.error(`${err.message}`);
      return this.responseService.json(res, err);
    }
  }
  

  @Get('/:id')
  async getOneWallet(
    @Res() res: Response,
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
  ) {
    try {
      const data = await this.walletService.findOneWallet({userId:user.id, id});
      return this.responseService.json(res, STATUS_CODE_ENUM.OK, 'wallet fetched successfully', data);
    } catch (err) {
      this.logger.error(`${err.message}`);
      return this.responseService.json(res, err);
    }
  }
  @Get('/transactions/:id')
  async getOneTransaction(
    @Res() res: Response,
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
  ) {
    try {
      const data = await this.walletService.findOneWalletTransaction({userId:user.id, id});
      return this.responseService.json(res, STATUS_CODE_ENUM.OK, 'transaction fetched successfully', data);
    } catch (err) {
      this.logger.error(`${err.message}`);
      return this.responseService.json(res, err);
    }
  }
}

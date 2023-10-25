import { Controller, Get, Inject, Query, Res, UseGuards } from '@nestjs/common';
import { Logger } from 'winston';
import { JWTAuthGuard } from '@src/auth/guards/jwt-auth.guard';
import RolesGuard from '@src/auth/guards/role.guard';
import { Roles } from '@src/shared/decorators/role.decorator';
import { Response } from 'express';
import { ResponseService } from '@src/shared/services/response.service';
import { LOGGER, STATUS_CODE_ENUM } from '@src/constant';
import { WalletService } from '../wallet.service';
import { FindAllTransactionDTO, FindAllWalletDTO } from '../dtos';
import { ENUM_ROLE_TYPE } from '@src/modules/user/interfaces';

@Controller({ path: 'admin/wallet', version: '1' })
export class WalletAdminController {
  private logger: Logger;
  constructor(
    @Inject(LOGGER) logger: Logger,
    private readonly walletService: WalletService,
    private responseService: ResponseService,
  ) {
    this.logger = logger.child({
      context: { service: 'WalletAdminController', module: 'Wallet' },
    });
  }
  @Roles(ENUM_ROLE_TYPE.ADMIN, ENUM_ROLE_TYPE.SUPER_ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Get('/')
  async listWallets(
    @Res() res: Response,
    @Query() params: FindAllWalletDTO,
  ) {
    try {
      const { page, limit, all, select, relations, ...search } = params;
      const s = select?.split(',').filter((item) => item.length > 0);
      const r = relations?.split(',').filter((item) => item.length > 0);
      const payload = await this.walletService.findAllWallets(
        { page, limit, all },
        search,
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
  @Roles(ENUM_ROLE_TYPE.ADMIN, ENUM_ROLE_TYPE.SUPER_ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Get('/transactions')
  async listWalletTransactions(
    @Res() res: Response,
    @Query() params: FindAllTransactionDTO,
  ) {
    try {
      const { page, limit, all, select, relations, ...search } = params;
      const s = select?.split(',').filter((item) => item.length > 0);
      const r = relations?.split(',').filter((item) => item.length > 0);
      const payload = await this.walletService.findAllTransactions(
        { page, limit, all },
        search,
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
}

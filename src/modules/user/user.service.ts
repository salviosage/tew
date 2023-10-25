import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from './entity/user.entity';
import { hash } from 'bcryptjs';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { DB_CONNECTION } from '@src/constant';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from '@src/auth/dtos';
import { Logger } from 'winston';
import { userRelations, userSelectfields } from './interfaces';
import { PaginationService } from '@src/shared/services/pagination.service';
import { PaginateDTO } from '@src/shared/types';
import { UtilityService } from '@src/shared/util';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity, DB_CONNECTION)
    private userRepository: Repository<UserEntity>,
    private paginationService: PaginationService,
    private utilityService: UtilityService
  ) {}

  async findAll(
    paginate: PaginateDTO,
    criteria?: FindOptionsWhere<UserEntity>,
    populate: string[] = undefined,
    filter: string[] = userSelectfields,
    order: any = undefined,
    logger?: Logger,
  ): Promise<any> {
    logger.info(`fetching users ${criteria}`);
    const { select, relations } = await this.utilityService.checkFiltersAndRelations(
      populate,
      userRelations,
      filter,
      userSelectfields,
      logger,
    );
    const { page, limit, all } = paginate;
    return await this.paginationService.paginate<UserEntity>(
      this.userRepository,
      criteria,
      page,
      limit,
      this.paginationService.castToBoolean(all),
      relations,
      order,
      select,
    );
  }
  async create(data: DeepPartial<UserEntity>): Promise<UserEntity> {
    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }


  async checkEmail(email: string): Promise<boolean> {
    return (await this.userRepository.count({ where: { email } })) > 0;
  }
  async createUser(
    payload: CreateUserDTO,
    logger: Logger,
  ): Promise<UserEntity> {
    logger.info(`creating user ${payload}`);
    const email = payload.email?.trim().toLocaleLowerCase();
    const [emailExist] = await Promise.all([
      this.checkEmail(email)
    ]);
    if (emailExist) {
      throw new BadRequestException('email already exist');
    }
    const pwd = await hash(payload.password, 10);
    return await this.create({
      ...payload,
      email,
      password: pwd,
      isActive: true,
    });
  }

  createOrUpdateUsers(payload: CreateUserDTO[], logger: Logger, session?: any) {
    payload.forEach(async (user) => {
      try {
        const { password } = user;
        const email = user?.email?.trim().toLocaleLowerCase();
        const username = user?.email?.trim().toLocaleLowerCase();
        const pwd = await hash(password, 10);
        const updateQuery = this.userRepository
          .createQueryBuilder('users')
          .update()
          .set({ ...user, email, password: pwd, isActive: true });
        const [emailExist] = await Promise.all([
          this.checkEmail(email)
        ]);
       
          if (emailExist) {
            updateQuery.where('users.email = :email', { email });
          await updateQuery.execute();
        } else {
          await this.userRepository.save({
            ...user,
            isActive: true,
            password: pwd,
          });
        }
      } catch (error) {
        logger.error(`error creating user ${error}`);
      }
    });
  }

  async findOneUser(
    criteria: FindOptionsWhere<UserEntity>,
  ): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: {
        ...criteria,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
  async update(
    query: FindOptionsWhere<UserEntity>,
    updates: DeepPartial<UserEntity>,
  ): Promise<UserEntity | undefined> {
    const user = await this.userRepository.update(query, { ...updates });
    if (user) {
      return user as any;
    }
    return undefined;
  }
}

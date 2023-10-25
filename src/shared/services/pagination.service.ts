import { Repository, SelectQueryBuilder } from 'typeorm';
import { isEmpty } from 'lodash';
import { } from '@nestjs/swagger';

export class PaginationService {
  async paginate<T>(
    repository: Repository<T>,
    criteria: any,
    page = 1,
    limit = 10,
    all = false,
    relations = [],
    order = { createdAt: 'DESC' } as Record<string, 'ASC' | 'DESC'>,
    select?: string[],
  ): Promise<PaginationResult<T>> {
    const pagination: { page: number; limit: number } = {
      page: Math.ceil(page),
      limit: Math.ceil(limit),
    };
    let result: T[] = [];
    let prevPage: number;
    let nextPage: number;

    const params: any = criteria || {}; // modify based on your criteria
    const count: number = await repository.count({ where: params });

    const totalPage = Math.ceil(count / pagination.limit);
    // add entity before each orderby element
    order = Object.keys(order).reduce(
      (acc, key) => {
        acc[`entity.${key}`] = order[key];
        return acc;
      },
      {} as Record<string, 'ASC' | 'DESC'>,
    );
    prevPage = pagination.page - 1 > 0 ? pagination.page - 1 : undefined;
    nextPage =
      pagination.page + 1 > totalPage ? undefined : pagination.page + 1;

    const queryBuilder: SelectQueryBuilder<T> = repository
      .createQueryBuilder('entity')
      .orderBy(order)
      .where(params);

    if (select && select.length > 0) {
      //add entity to each element in select
      select.forEach((element, index) => {
        select[index] = `entity.${element}`;
      });
      queryBuilder.select(select);
    }
    if (
      pagination.page >= 1 &&
      pagination.limit >= 1 &&
      totalPage >= pagination.page &&
      !all
    ) {
      const skip = limit * (pagination.page - 1);
      queryBuilder.skip(skip).take(pagination.limit);
    }
    if (!isEmpty(relations)) {
      relations.forEach((relation) => {
        queryBuilder.leftJoinAndSelect(`entity.${relation}`, relation);
      });
    }
    
    result = await queryBuilder.getMany();

    return {
      data: result,
      metadata: {
        page: pagination.page,
        perPage: pagination.limit,
        total: count,
        pageCount: result.length,
        previousPage: prevPage,
        nextPage,
      },
    };
  }
  castToBoolean(val) {
    if (!val) {
      return false;
    }
    return !(val === '0' || val === 'off' || val === 'false');
  }
}

export class PaginationMetaData {

  page: number;


  perPage: number;


  total: number;


  previousPage: number;


  nextPage: number;


  pageCount: number;
}
export interface PaginationResult<T> {
  data: T[];
  metadata: PaginationMetaData;
}

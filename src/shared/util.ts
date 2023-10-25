import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { Logger } from 'winston';

@Injectable()
export class UtilityService {
  constructor() {}
  static formatDate(date: Date, format?: string): string {
    return moment(date).format(format || 'Do MMM, YYYY');
  }

  async generateRandomString(length: number): Promise<string> {
    const chars =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result.trim();
  }

  async checkFiltersAndRelations(
    relations: string[],
    relationsArternatives: string[],
    select: string[],
    selectArternatives: string[],
    logger: Logger,
  ): Promise<any> {
    if (relations) {
      for (const relation of relations) {
        if (!relationsArternatives.includes(relation)) {
          relations = relations.filter((item) => item !== relation);
          logger.error(`relation ${relation} does not exist`);
        }
      }
    }
    if (select) {
      for (const field of select) {
        if (!selectArternatives.includes(field)) {
          select = select.filter((item) => item !== field);
          logger.error(`field ${field} does not exist`);
        }
      }
    }
    if (relations && !select.includes('createdAt')) {
      select.push('createdAt');
    }
    return { relations, select };
  }
}

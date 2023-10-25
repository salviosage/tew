import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {} from '@nestjs/swagger';
import { get, isNil, isEmpty } from 'lodash';
import { Response } from 'express';
import { PaginationMetaData } from './pagination.service';

export class ResponseObject<T> {
  code?: string;

  message?: string;

  data?: T;

  meta?: any;
}
const defaultStatus = 400;

@Injectable()
export class ResponseService {
  constructor(private configService: ConfigService) {}

  json<T>(
    res: Response,
    statusOrError: number | Error,
    message?: string,
    data?: Record<string, unknown> | Array<Record<string, unknown>> | T,
    meta?: PaginationMetaData,
    code?: string,
  ): void {
    const error = statusOrError instanceof Error ? statusOrError : null;

    const responseObj: ResponseObject<typeof data> = {};
    responseObj.message = message;

    let status = statusOrError;

    if (error) {
      const errorObj = statusOrError as Error;
      responseObj.message = message || errorObj.message;
      status = get(errorObj, 'status', defaultStatus);
    }

    if (!isNil(data)) {
      responseObj.data = data;
    }
    if (!isNil(meta)) {
      responseObj.meta = meta;
    }
    if (!isEmpty(code)) {
      responseObj.code = code;
    }

    const statusCode = status as number;
    res.status(statusCode).json(responseObj);
  }

  static statiJson<T>(
    res: Response,
    statusOrError: number | Error,
    message?: string,
    data?: Record<string, unknown> | Array<Record<string, unknown>> | T,
    meta?: PaginationMetaData,
    code?: string,
  ): void {
    const error = statusOrError instanceof Error ? statusOrError : null;

    const responseObj: ResponseObject<typeof data> = {};
    responseObj.message = message;

    let status = statusOrError;

    if (error) {
      const errorObj = statusOrError as Error;
      responseObj.message = message || errorObj.message;
      status = get(errorObj, 'status', defaultStatus);
    }

    if (!isNil(data)) {
      responseObj.data = data;
    }
    if (!isNil(meta)) {
      responseObj.meta = meta;
    }
    if (!isEmpty(code)) {
      responseObj.code = code;
    }

    const statusCode = status as number;
    res.status(statusCode).json(responseObj);
  }
}

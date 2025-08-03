import { Injectable } from '@nestjs/common';
import { PaginationFilterDto, PaginatedResponseDto } from '../../application/dtos/pagination.dto';

@Injectable()
export class PaginationService {
  paginate<T>(
    data: T[],
    totalItems: number,
    filter: PaginationFilterDto
  ): PaginatedResponseDto<T> {
    const page = Number(filter.page) || 1;
    const limit = Number(filter.limit) || 10;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      meta: {
        page,
        limit,
        totalItems,
        totalPages
      }
    };
  }

  buildWhereClauses(
    filter: PaginationFilterDto,
    searchFields: string[] = ['name']
  ): any {
    const where: any = {};

    if (filter.search) {
      where.OR = searchFields.map(field => ({
        [field]: { contains: filter.search, mode: 'insensitive' }
      }));
    }

    return where;
  }

  buildOrderByClause(
    filter: PaginationFilterDto,
    defaultSortField: string = 'name'
  ): any {
    const field = filter.sortBy || defaultSortField;
    const direction = filter.sortOrder || 'asc';

    return { [field]: direction };
  }

  getPaginationParameters(filter: PaginationFilterDto): { skip: number; take: number } {
    const page = Number(filter.page) || 1;
    const limit = Number(filter.limit) || 10;

    return {
      skip: (page - 1) * limit,
      take: limit
    };
  }
}
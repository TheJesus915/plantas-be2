import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  HttpStatus
} from '@nestjs/common';
import { RoleRepositoryInterface } from '../../domain/interfaces/role.repository.interface';
import { RoleResponseDto } from '../dtos/role-response.dto';
import { RoleMapper } from '../../infrastructure/mappers/role.mapper';

@Injectable()
export class GetRoleByIdUseCase {
  constructor(
    @Inject('RoleRepositoryInterface')
    private readonly roleRepository: RoleRepositoryInterface,
    private readonly roleMapper: RoleMapper
  ) {}

  async execute(id: string): Promise<RoleResponseDto> {
    try {
      if (!id) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Role ID is required',
          error: 'Bad Request'
        });
      }

      const role = await this.roleRepository.findById(id);

      if (!role) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: `Role with ID '${id}' not found`,
          error: 'Not Found'
        });
      }

      return this.roleMapper.toResponseDto(role);

    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occurred while retrieving the role',
        error: 'Internal Server Error'
      });
    }
  }
}
import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
  HttpStatus
} from '@nestjs/common';
import { RoleRepositoryInterface } from '../../domain/interfaces/role.repository.interface';

@Injectable()
export class DeleteRoleUseCase {
  constructor(
    @Inject('RoleRepositoryInterface')
    private readonly roleRepository: RoleRepositoryInterface
  ) {}

  async execute(id: string): Promise<void> {
    try {

      const existingRole = await this.roleRepository.findById(id);
      if (!existingRole) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: `Role with ID '${id}' not found`,
          error: 'Not Found'
        });
      }

      const userCount = await this.roleRepository.getUserCountByRole(id);
      if (userCount > 0) {
        throw new ConflictException({
          statusCode: HttpStatus.CONFLICT,
          message: `Cannot delete role '${existingRole.name}' because it has ${userCount} user(s) assigned`,
          error: 'Conflict'
        });
      }

      await this.roleRepository.delete(id);

    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occurred while deleting the role',
        error: 'Internal Server Error'
      });
    }
  }
}
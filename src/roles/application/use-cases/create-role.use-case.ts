import {
  Injectable,
  Inject,
  ConflictException,
  BadRequestException,
  NotFoundException
} from '@nestjs/common';
import { RoleRepositoryInterface } from '../../domain/interfaces/role.repository.interface';
import { CreateRoleDto } from '../dtos/create-role.dto';

@Injectable()
export class CreateRoleUseCase {
  constructor(
    @Inject('RoleRepositoryInterface')
    private readonly roleRepository: RoleRepositoryInterface,
  ) {}

  async execute(createRoleDto: CreateRoleDto): Promise<{ id: string }> {
    try {
      const trimmedName = createRoleDto.name.trim();

      const existingRole = await this.roleRepository.findByName(trimmedName);
      if (existingRole) {
        throw new ConflictException({
          statusCode: 409,
          message: `Role with name '${trimmedName}' already exists`
        });
      }

      if (!trimmedName) {
        throw new BadRequestException({
          statusCode: 400,
          message: 'Role name cannot be empty or just whitespace'
        });
      }

      const roleData = {
        name: trimmedName,
        description: createRoleDto.description?.trim() || null,
        is_active: true,
        created_date: new Date()
      };

      const permissions = createRoleDto.permissions || [];
      if (permissions.length > 0) {
        const uniqueModuleIds = new Set(permissions.map(p => p.module_id));
        if (uniqueModuleIds.size !== permissions.length) {
          throw new BadRequestException({
            statusCode: 400,
            message: 'Duplicate module permissions found'
          });
        }
      }

      const createdRole = await this.roleRepository.create(roleData, permissions);
      return { id: createdRole.id };

    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }

      if (error.code === 'P2003') {
        throw new NotFoundException({
          message: 'Module not found',
          error: 'Not Found',
          statusCode: 404
        });
      }

      throw new BadRequestException({
        message: 'An unexpected error occurred while creating the role',
        error: 'Bad Request',
        statusCode: 400
      });
    }
  }
}
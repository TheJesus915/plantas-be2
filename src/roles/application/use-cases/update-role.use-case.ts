import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  BadRequestException,
  HttpStatus
} from '@nestjs/common';
import { RoleRepositoryInterface } from '../../domain/interfaces/role.repository.interface';
import { UpdateRoleDto } from '../dtos/update-role.dto';

type RoleUpdateData = {
  name?: string;
  description?: string | null;
  is_active?: boolean;
}

@Injectable()
export class UpdateRoleUseCase {
  constructor(
    @Inject('RoleRepositoryInterface')
    private readonly roleRepository: RoleRepositoryInterface
  ) {}

  async execute(
    id: string,
    dto: UpdateRoleDto
  ): Promise<{ id: string }> {
    if (!id?.trim()) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Role ID is required',
        error: 'Bad Request'
      });
    }

    const existingRole = await this.roleRepository.findById(id);
    if (!existingRole) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Role with ID '${id}' not found`,
        error: 'Not Found'
      });
    }

    const updates: RoleUpdateData = {};

    if (dto.name) {
      const trimmedName = dto.name.trim();
      if (trimmedName !== existingRole.name) {
        const nameExists = await this.roleRepository.checkRoleExists(trimmedName, id);
        if (nameExists) {
          throw new ConflictException({
            statusCode: HttpStatus.CONFLICT,
            message: `Role with name '${trimmedName}' already exists`,
            error: 'Conflict'
          });
        }
        updates.name = trimmedName;
      }
    }

    if (dto.description !== undefined) {
      updates.description = dto.description.trim() || null;
    }

    if (dto.is_active !== undefined) {
      updates.is_active = dto.is_active;
    }

    let permissions = dto.permissions?.map(p => ({
      module_id: p.module_id,
      permissions: p.permissions
    }));

    await this.roleRepository.update(id, updates, permissions);

    return { id };
  }
}
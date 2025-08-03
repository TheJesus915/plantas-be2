import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserGeneralRepository } from '../../domain/interfaces/user-general-repository.interface';
import { UpdateStatusAccountDto } from '../dtos/update-status-account.dto';

@Injectable()
export class UpdateStatusAccountUseCase {
  constructor(
    @Inject('IUserGeneralRepository')
    private readonly userGeneralRepository: IUserGeneralRepository,
  ) {}

  async execute(id: string, dto: UpdateStatusAccountDto): Promise<{ id: string }> {
    if (!dto.status_account) {
      throw new Error('Status account is required');
    }
    const result = await this.userGeneralRepository.updateStatusAccount(id, dto.status_account);
    if (!result) {
      throw new NotFoundException('User not found');
    }
    return result;
  }
}

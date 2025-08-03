import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserGeneralRepository } from '../../domain/interfaces/user-general-repository.interface';
import { UserGeneralMapper } from '../../infrastructure/mappers/user-general.mapper';
import { UserGeneralDetailDto } from '../dtos/user-general.dto';

@Injectable()
export class GetGeneralUserByIdUseCase {
  constructor(
    @Inject('IUserGeneralRepository')
    private readonly userGeneralRepository: IUserGeneralRepository,
  ) {}

  async execute(id: string): Promise<UserGeneralDetailDto> {
    const user = await this.userGeneralRepository.findGeneralUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return UserGeneralMapper.toDetailDto(user);
  }
}


import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  BadRequestException,
  ConflictException,
  NotFoundException,
  Put,
  Delete,
  Inject,
  ValidationPipe,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../../shared/infrastructure/guards/jwt-auth.guard';
import { CreateWateringGroupDto } from '../../application/dtos/create-watering-group.dto';
import { CreateWateringScheduleDto } from '../../application/dtos/create-watering-schedule.dto';
import { AddPotsToGroupDto } from '../../application/dtos/add-pots-to-group.dto';
import { UpdateWateringGroupDto } from '../../application/dtos/update-watering-group.dto';
import { UpdateWateringScheduleDto } from '../../application/dtos/update-watering-schedule.dto';
import { CreateWateringGroupUseCase } from '../../application/use-cases/create-watering-group.use-case';
import { AddPotsToGroupUseCase } from '../../application/use-cases/add-pots-to-group.use-case';
import { CreateWateringScheduleUseCase } from '../../application/use-cases/create-watering-schedule.use-case';
import { GetWateringGroupByIdUseCase } from '../../application/use-cases/get-watering-group-by-id.use-case';
import { GetWateringGroupsUseCase } from '../../application/use-cases/get-watering-groups.use-case';
import { UpdateWateringGroupUseCase } from '../../application/use-cases/update-watering-group.use-case';
import { UpdateWateringScheduleUseCase } from '../../application/use-cases/update-watering-schedule.use-case';
import { RemovePotFromGroupUseCase } from '../../application/use-cases/remove-pot-from-group.use-case';
import { DeleteWateringGroupUseCase } from '../../application/use-cases/delete-watering-group.use-case';
import { PaginationFilterDto } from '../../../shared/application/dtos/pagination.dto';
import { UploadWateringGroupImageUseCase } from '../../application/use-cases/upload-watering-group-image.use-case';
import { UpdateWateringGroupImageUseCase } from '../../application/use-cases/update-watering-group-image.use-case';
import { DeleteWateringGroupImageUseCase } from '../../application/use-cases/delete-watering-group-image.use-case';
import { ManualWateringControlDto } from '../../application/dtos/manual-watering-control.dto';
import { ManualWateringControlUseCase } from '../../application/use-cases/manual-watering-control.use-case';

@Controller('watering')
@UseGuards(JwtAuthGuard)
export class WateringController {
  constructor(
    private readonly createWateringGroupUseCase: CreateWateringGroupUseCase,
    private readonly addPotsToGroupUseCase: AddPotsToGroupUseCase,
    private readonly createWateringScheduleUseCase: CreateWateringScheduleUseCase,
    private readonly getWateringGroupByIdUseCase: GetWateringGroupByIdUseCase,
    private readonly getWateringGroupsUseCase: GetWateringGroupsUseCase,
    private readonly updateWateringGroupUseCase: UpdateWateringGroupUseCase,
    private readonly updateWateringScheduleUseCase: UpdateWateringScheduleUseCase,
    private readonly removePotFromGroupUseCase: RemovePotFromGroupUseCase,
    private readonly deleteWateringGroupUseCase: DeleteWateringGroupUseCase,
    private readonly uploadWateringGroupImageUseCase: UploadWateringGroupImageUseCase,
    private readonly updateWateringGroupImageUseCase: UpdateWateringGroupImageUseCase,
    private readonly deleteWateringGroupImageUseCase: DeleteWateringGroupImageUseCase,
    private readonly manualWateringControlUseCase: ManualWateringControlUseCase
  ) {}

  @Post('groups')
  @HttpCode(HttpStatus.CREATED)
  async createGroup(@Request() req, @Body() createWateringGroupDto: CreateWateringGroupDto) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }

      const id = await this.createWateringGroupUseCase.execute(userId, createWateringGroupDto);
      return { id };
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to create watering group: ${error.message}`);
    }
  }

  @Get('groups')
  @HttpCode(HttpStatus.OK)
  async getAllGroups(
    @Request() req,
    @Query(new ValidationPipe({
      transform: true,
      whitelist: true
    })) paginationFilterDto: PaginationFilterDto
  ) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }

      return this.getWateringGroupsUseCase.execute(userId, paginationFilterDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to get watering groups: ${error.message}`);
    }
  }

  @Get('groups/:id')
  @HttpCode(HttpStatus.OK)
  async getGroupById(@Request() req, @Param('id') id: string) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }

      const result = await this.getWateringGroupByIdUseCase.execute(userId, id);
      if (!result) {
        throw new NotFoundException('Watering group not found');
      }

      return result;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to get watering group: ${error.message}`);
    }
  }

  @Post('groups/:id/pots')
  @HttpCode(HttpStatus.OK)
  async addPotsToGroup(
    @Request() req,
    @Param('id') groupId: string,
    @Body() addPotsToGroupDto: AddPotsToGroupDto
  ) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }

      await this.addPotsToGroupUseCase.execute(userId, groupId, addPotsToGroupDto);
      return { id: groupId };
    } catch (error) {
      if (error instanceof ConflictException ||
        error instanceof NotFoundException ||
        error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to add pots to watering group: ${error.message}`);
    }
  }

  @Post('groups/:id/schedules')
  @HttpCode(HttpStatus.CREATED)
  async createSchedule(
    @Request() req,
    @Param('id') groupId: string,
    @Body() createWateringScheduleDto: CreateWateringScheduleDto
  ) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }

      const id = await this.createWateringScheduleUseCase.execute(
        userId,
        groupId,
        createWateringScheduleDto
      );
      return { id };
    } catch (error) {
      if (error instanceof ConflictException ||
        error instanceof NotFoundException ||
        error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to create watering schedule: ${error.message}`);
    }
  }

  @Put('groups/:id')
  @HttpCode(HttpStatus.OK)
  async updateGroup(
    @Request() req,
    @Param('id') id: string,
    @Body() updateWateringGroupDto: UpdateWateringGroupDto
  ) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }

      await this.updateWateringGroupUseCase.execute(userId, id, updateWateringGroupDto);
      return { id };
    } catch (error) {
      if (error instanceof ConflictException ||
        error instanceof NotFoundException ||
        error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update watering group: ${error.message}`);
    }
  }

  @Put('schedules/:id')
  @HttpCode(HttpStatus.OK)
  async updateSchedule(
    @Request() req,
    @Param('id') id: string,
    @Body() updateWateringScheduleDto: UpdateWateringScheduleDto
  ) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }

      await this.updateWateringScheduleUseCase.execute(userId, id, updateWateringScheduleDto);
      return { id };
    } catch (error) {
      if (error instanceof ConflictException ||
        error instanceof NotFoundException ||
        error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update watering schedule: ${error.message}`);
    }
  }

  @Delete('groups/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeGroup(@Request() req, @Param('id') id: string) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    await this.deleteWateringGroupUseCase.execute(userId, id);
  }

  @Delete('groups/:id/pots/:potId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removePotFromGroup(
    @Request() req,
    @Param('id') groupId: string,
    @Param('potId') potId: string
  ) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }

      await this.removePotFromGroupUseCase.execute(userId, groupId, potId);
    } catch (error) {
      if (error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to remove pot from watering group: ${error.message}`);
    }
  }

  @Post('images/groups')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.OK)
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    try {

      const imageUrl = await this.uploadWateringGroupImageUseCase.execute(file);
      return { imageUrl };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to upload image: ${error.message}`);
    }
  }

  @Put('groups/:id/image')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.OK)
  async updateGroupImage(
    @Param('id') groupId: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req
  ) {
    try {
      const userId = req.user?.sub;
      const imageUrl = await this.updateWateringGroupImageUseCase.execute(userId, groupId, file);
      return { imageUrl };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update group image: ${error.message}`);
    }
  }

  @Delete('groups/:id/image')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteGroupImage(
    @Param('id') groupId: string,
    @Request() req
  ) {
    try {
      const userId = req.user?.sub;
      const result = await this.deleteWateringGroupImageUseCase.execute(userId, groupId);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete group image: ${error.message}`);
    }
  }
  @Post('manual-control')
  @HttpCode(HttpStatus.OK)
  async manualWateringControl(@Request() req, @Body() manualWateringControlDto: ManualWateringControlDto) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }

      await this.manualWateringControlUseCase.execute(userId, manualWateringControlDto);
      return { message: 'Watering control executed successfully' };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(`Failed to execute manual watering control: ${error.message}`);
    }
  }
}
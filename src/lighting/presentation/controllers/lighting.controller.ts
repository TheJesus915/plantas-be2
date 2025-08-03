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
  ValidationPipe,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../../shared/infrastructure/guards/jwt-auth.guard';
import { CreateLightingGroupDto } from '../../application/dtos/create-lighting-group.dto';
import { CreateLightingScheduleDto } from '../../application/dtos/create-lighting-schedule.dto';
import { AddPotsToGroupDto } from '../../application/dtos/add-pots-to-group.dto';
import { UpdateLightingGroupDto } from '../../application/dtos/update-lighting-group.dto';
import { UpdateLightingScheduleDto } from '../../application/dtos/update-lighting-schedule.dto';
import { CreateLightingGroupUseCase } from '../../application/use-cases/create-lighting-group.use-case';
import { AddPotsToGroupUseCase } from '../../application/use-cases/add-pots-to-group.use-case';
import { CreateLightingScheduleUseCase } from '../../application/use-cases/create-lighting-schedule.use-case';
import { GetLightingGroupByIdUseCase } from '../../application/use-cases/get-lighting-group-by-id.use-case';
import { GetLightingGroupsUseCase } from '../../application/use-cases/get-lighting-groups.use-case';
import { UpdateLightingGroupUseCase } from '../../application/use-cases/update-lighting-group.use-case';
import { UpdateLightingScheduleUseCase } from '../../application/use-cases/update-lighting-schedule.use-case';
import { RemovePotFromGroupUseCase } from '../../application/use-cases/remove-pot-from-group.use-case';
import { DeleteLightingGroupUseCase } from '../../application/use-cases/delete-lighting-group.use-case';
import { PaginationFilterDto } from '../../../shared/application/dtos/pagination.dto';
import { UploadLightingGroupImageUseCase } from '../../application/use-cases/upload-lighting-group-image.use-case';
import { UpdateLightingGroupImageUseCase } from '../../application/use-cases/update-lighting-group-image.use-case';
import { DeleteLightingGroupImageUseCase } from '../../application/use-cases/delete-lighting-group-image.use-case';
import { ManualLightingControlUseCase } from '../../application/use-cases/manual-lighting-control.use-case';
import { ManualLightingControlDto } from '../../application/dtos/manual-lighting-control.dto';

@Controller('lighting')
@UseGuards(JwtAuthGuard)
export class LightingController {
  constructor(
    private readonly createLightingGroupUseCase: CreateLightingGroupUseCase,
    private readonly addPotsToGroupUseCase: AddPotsToGroupUseCase,
    private readonly createLightingScheduleUseCase: CreateLightingScheduleUseCase,
    private readonly getLightingGroupByIdUseCase: GetLightingGroupByIdUseCase,
    private readonly getLightingGroupsUseCase: GetLightingGroupsUseCase,
    private readonly updateLightingGroupUseCase: UpdateLightingGroupUseCase,
    private readonly updateLightingScheduleUseCase: UpdateLightingScheduleUseCase,
    private readonly removePotFromGroupUseCase: RemovePotFromGroupUseCase,
    private readonly deleteLightingGroupUseCase: DeleteLightingGroupUseCase,
    private readonly uploadLightingGroupImageUseCase: UploadLightingGroupImageUseCase,
    private readonly updateLightingGroupImageUseCase: UpdateLightingGroupImageUseCase,
    private readonly deleteLightingGroupImageUseCase: DeleteLightingGroupImageUseCase,
    private readonly manualLightingControlUseCase: ManualLightingControlUseCase,
  ) {}

  @Post('groups')
  @HttpCode(HttpStatus.CREATED)
  async createGroup(@Request() req, @Body() createLightingGroupDto: CreateLightingGroupDto) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }

      const id = await this.createLightingGroupUseCase.execute(userId, createLightingGroupDto);
      return { id };
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to create lighting group: ${error.message}`);
    }
  }

  @Post('manual-control')
  @HttpCode(HttpStatus.OK)
  async manualLightingControl(@Request() req, @Body() manualLightingControlDto: ManualLightingControlDto) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }

      await this.manualLightingControlUseCase.execute(userId, manualLightingControlDto);
      return { message: 'Lighting control executed successfully' };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(`Failed to execute manual lighting control: ${error.message}`);
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

      return this.getLightingGroupsUseCase.execute(userId, paginationFilterDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to get lighting groups: ${error.message}`);
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

      return this.getLightingGroupByIdUseCase.execute(userId, id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to get lighting group: ${error.message}`);
    }
  }

  @Put('groups/:id')
  @HttpCode(HttpStatus.OK)
  async updateGroup(
    @Request() req,
    @Param('id') id: string,
    @Body() updateLightingGroupDto: UpdateLightingGroupDto
  ) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }

      const updatedId = await this.updateLightingGroupUseCase.execute(userId, id, updateLightingGroupDto);
      return { id: updatedId };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(`Failed to update lighting group: ${error.message}`);
    }
  }

  @Delete('groups/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteGroup(@Request() req, @Param('id') id: string) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }

      await this.deleteLightingGroupUseCase.execute(userId, id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete lighting group: ${error.message}`);
    }
  }

  @Post('groups/:id/pots')
  @HttpCode(HttpStatus.OK)
  async addPotsToGroup(
    @Request() req,
    @Param('id') id: string,
    @Body() addPotsToGroupDto: AddPotsToGroupDto
  ) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }

      await this.addPotsToGroupUseCase.execute(userId, id, addPotsToGroupDto);
      return { message: 'Pots added successfully' };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(`Failed to add pots to group: ${error.message}`);
    }
  }

  @Delete('groups/:id/pots/:potId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removePotFromGroup(@Request() req, @Param('id') id: string, @Param('potId') potId: string) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }

      await this.removePotFromGroupUseCase.execute(userId, id, potId);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(`Failed to remove pot from group: ${error.message}`);
    }
  }

  @Post('groups/:id/schedules')
  @HttpCode(HttpStatus.CREATED)
  async createSchedule(
    @Request() req,
    @Param('id') id: string,
    @Body() createLightingScheduleDto: CreateLightingScheduleDto
  ) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }

      const scheduleId = await this.createLightingScheduleUseCase.execute(userId, id, createLightingScheduleDto);
      return { id: scheduleId };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(`Failed to create lighting schedule: ${error.message}`);
    }
  }

  @Put('schedules/:id')
  @HttpCode(HttpStatus.OK)
  async updateSchedule(
    @Request() req,
    @Param('id') id: string,
    @Body() updateLightingScheduleDto: UpdateLightingScheduleDto
  ) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }

      const scheduleId = await this.updateLightingScheduleUseCase.execute(userId, id, updateLightingScheduleDto);
      return { id: scheduleId };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(`Failed to update lighting schedule: ${error.message}`);
    }
  }

  @Post('groups/image')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.OK)
  async uploadImage(@UploadedFile() file) {
    try {
      if (!file) {
        throw new BadRequestException('Image file is required');
      }

      const imageUrl = await this.uploadLightingGroupImageUseCase.execute(file);
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
  async updateImage(@Request() req, @Param('id') id: string, @UploadedFile() file) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }

      if (!file) {
        throw new BadRequestException('Image file is required');
      }

      const imageUrl = await this.updateLightingGroupImageUseCase.execute(userId, id, file);
      return { imageUrl };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update image: ${error.message}`);
    }
  }

  @Delete('groups/:id/image')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteImage(@Request() req, @Param('id') id: string) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }

      await this.deleteLightingGroupImageUseCase.execute(userId, id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete image: ${error.message}`);
    }
  }
}

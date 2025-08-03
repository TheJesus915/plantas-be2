import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  Body,
  InternalServerErrorException,
  Delete,
  Param,
  Put,
  UploadedFile, UseGuards,
} from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { UploadPlantImagesUseCase } from '../../application/use-cases/plant-images/upload-plant-images.use-case';
import { LinkPlantImageUseCase } from '../../application/use-cases/plant-images/link-plant-images.use-case';
import { DeletePlantImageUseCase } from '../../application/use-cases/plant-images/delete-plant-image.use-case';
import { UpdatePlantImageFileUseCase } from '../../application/use-cases/plant-images/update-plant-image-file.use-case';
import { JwtAuthGuard } from '../../../shared/infrastructure/guards/jwt-auth.guard';
import {
  ModulePermissionGuard,
  RequirePermission,
} from '../../../shared/infrastructure/guards/module-permission.guard';
import { PermissionAction } from '@prisma/client';
import { DeletePlantImageDto } from '../../application/dtos/plant-images/delete-plant-image.dto';
@Controller('plant-images')
@UseGuards(JwtAuthGuard, ModulePermissionGuard)
export class PlantImagesController {
  private handleError(error: any) {
    if (error instanceof BadRequestException) {
      throw error;
    }
    throw new InternalServerErrorException(`Error processing image: ${error.message}`);
  }
  constructor(
    private readonly uploadPlantImagesUseCase: UploadPlantImagesUseCase,
    private readonly linkPlantImageUseCase: LinkPlantImageUseCase ,
    private readonly deletePlantImageUseCase: DeletePlantImageUseCase,
    private readonly updatePlantImageFileUseCase: UpdatePlantImageFileUseCase,
  ) {
  }

  @Post('upload')
  @RequirePermission('plants', PermissionAction.CREATE)
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      limits: { fileSize: Number(process.env.SUPABASE_MAX_FILE_SIZE) || 5242880 },
      fileFilter(req, file, cb) {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new BadRequestException('Only image files are allowed'), false);
        }
        cb(null, true);
      },
    })
  )
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    try {
      if (!files || files.length === 0) {
        throw new BadRequestException('No files provided');
      }
      return await this.uploadPlantImagesUseCase.execute(files);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Post('link/:plantId')
  @RequirePermission('plants', PermissionAction.CREATE)
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: Number(process.env.SUPABASE_MAX_FILE_SIZE) || 5242880 },
      fileFilter(req, file, cb) {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new BadRequestException('Only image files are allowed'), false);
        }
        cb(null, true);
      },
    })
  )
  async linkImageToPlant(
    @Param('plantId') plantId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (!file) {
        throw new BadRequestException('No image file provided');
      }

      const dto = { catalogPlantId: plantId };

      return await this.linkPlantImageUseCase.execute(dto, file);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Put(':id/update-file')
  @RequirePermission('plants', PermissionAction.UPDATE)
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: Number(process.env.SUPABASE_MAX_FILE_SIZE) || 5242880 },
      fileFilter(req, file, cb) {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new BadRequestException('Only image files are allowed'), false);
        }
        cb(null, true);
      },
    })
  )
  async updateImageFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (!file) {
        throw new BadRequestException('No image file provided');
      }
      return await this.updatePlantImageFileUseCase.execute(id, file);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Delete(':id')
  @RequirePermission('plants', PermissionAction.DELETE)
  async deleteImage(@Param('id') id: string) {
    try {
      const dto: DeletePlantImageDto = { imageId: id };
      return await this.deletePlantImageUseCase.execute(dto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting image: ' + error.message);
    }
  }
}
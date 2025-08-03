import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Request,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  HttpCode,
  HttpStatus,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../../shared/infrastructure/guards/jwt-auth.guard';
import { CreateAreaDto } from '../../application/dtos/areas/create-area.dto';
import { UpdateAreaDto } from '../../application/dtos/areas/update-area.dto';
import { PaginationFilterDto } from '../../../shared/application/dtos/pagination.dto';
import { CreateAreaUseCase } from '../../application/use-cases/areas/create-area.use-case';
import { UpdateAreaUseCase } from '../../application/use-cases/areas/update-area.use-case';
import { GetAreaUseCase } from '../../application/use-cases/areas/get-area.use-case';
import { GetAreasUseCase } from '../../application/use-cases/areas/get-areas.use-case';
import { DeleteAreaUseCase } from '../../application/use-cases/areas/delete-area.use-case';
import { GardenImageService } from '../../infrastructure/services/garden-image.service';

@Controller('areas')
@UseGuards(JwtAuthGuard)
export class AreasController {
  constructor(
    private readonly createAreaUseCase: CreateAreaUseCase,
    private readonly updateAreaUseCase: UpdateAreaUseCase,
    private readonly getAreaUseCase: GetAreaUseCase,
    private readonly getAreasUseCase: GetAreasUseCase,
    private readonly deleteAreaUseCase: DeleteAreaUseCase,
    private readonly gardenImageService: GardenImageService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createArea(@Request() req, @Body() createAreaDto: CreateAreaDto) {
    try {
      const userId = req.user?.sub;
      return await this.createAreaUseCase.execute(userId, createAreaDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create area');
    }
  }

  @Post('upload-image')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image', {
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/^image\/(jpeg|png|jpg|webp)$/)) {
        return cb(new BadRequestException('Only image files (JPEG, PNG, WEBP) are allowed'), false);
      }
      cb(null, true);
    },
  }))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No image has been provided');
    }

    try {
      const imageUrl = await this.gardenImageService.uploadAreaImage(file);
      if (!imageUrl) {
        throw new BadRequestException('Failed to upload image');
      }
      return { url: imageUrl };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to upload image');
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAreas(@Request() req, @Query() filter: PaginationFilterDto) {
    try {
      const userId = req.user?.sub;
      return await this.getAreasUseCase.execute(userId, filter);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve areas');
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getArea(@Request() req, @Param('id') id: string) {
    try {
      const userId = req.user?.sub;
      return await this.getAreaUseCase.execute(userId, id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof ForbiddenException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve area');
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateArea(
    @Request() req,
    @Param('id') id: string,
    @Body() updateAreaDto: UpdateAreaDto,
  ) {
    try {
      const userId = req.user?.sub;
      return await this.updateAreaUseCase.execute(userId, id, updateAreaDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof ForbiddenException) {
        throw error;
      }
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to update area');
    }
  }

  @Put(':id/image')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('image', {
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/^image\/(jpeg|png|jpg|webp)$/)) {
        return cb(new BadRequestException('Only image files (JPEG, PNG, WEBP) are allowed'), false);
      }
      cb(null, true);
    },
  }))
  async updateImage(
    @Request() req,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No image has been provided');
    }

    try {
      const userId = req.user?.sub;
      const area = await this.getAreaUseCase.execute(userId, id);

      if (area.image_url) {
        await this.gardenImageService.updateImage(area.image_url, file);
        return { id: area.id };
      } else {
        const imageUrl = await this.gardenImageService.uploadAreaImage(file);
        if (!imageUrl) {
          throw new BadRequestException('Failed to upload image');
        }
        const result = await this.updateAreaUseCase.execute(userId, id, { image_url: imageUrl });
        return result;
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof ForbiddenException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to update area image');
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArea(@Request() req, @Param('id') id: string) {
    try {
      const userId = req.user?.sub;
      await this.deleteAreaUseCase.execute(userId, id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof ForbiddenException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete area');
    }
  }

  @Delete(':id/image')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteImage(@Request() req, @Param('id') id: string) {
    try {
      const userId = req.user?.sub;
      const area = await this.getAreaUseCase.execute(userId, id);

      if (!area.image_url) {
        throw new BadRequestException('This area does not have an image to delete');
      }

      await this.gardenImageService.deleteImage(area.image_url);
      await this.updateAreaUseCase.execute(userId, id, { image_url: '' });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof ForbiddenException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete area image');
    }
  }
}
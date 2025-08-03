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
import { CreatePotDto } from '../../application/dtos/pots/create-pot.dto';
import { UpdatePotDto } from '../../application/dtos/pots/update-pot.dto';
import { PotFilterDto } from '../../application/dtos/pots/pot-filter.dto';
import { CreatePotUseCase } from '../../application/use-cases/pots/create-pot.use-case';
import { UpdatePotUseCase } from '../../application/use-cases/pots/update-pot.use-case';
import { GetPotUseCase } from '../../application/use-cases/pots/get-pot.use-case';
import { GetPotsUseCase } from '../../application/use-cases/pots/get-pots.use-case';
import { DeletePotUseCase } from '../../application/use-cases/pots/delete-pot.use-case';
import { GardenImageService } from '../../infrastructure/services/garden-image.service';
import {
  PotNotFoundError,
  PotNotOwnedError,
  InvalidPotStateError,
  DuplicatePotNameError,
  PlantNotFoundError,
  AreaNotFoundError
} from '../../domain/errors/pot.errors';

@Controller('pots')
@UseGuards(JwtAuthGuard)
export class PotsController {
  constructor(
    private readonly createPotUseCase: CreatePotUseCase,
    private readonly updatePotUseCase: UpdatePotUseCase,
    private readonly getPotUseCase: GetPotUseCase,
    private readonly getPotsUseCase: GetPotsUseCase,
    private readonly deletePotUseCase: DeletePotUseCase,
    private readonly gardenImageService: GardenImageService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPot(@Request() req, @Body() createPotDto: CreatePotDto) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }
      return await this.createPotUseCase.execute(userId, createPotDto);
    } catch (error) {
      if (error instanceof DuplicatePotNameError) {
        throw new ConflictException(error.message);
      }
      if (error instanceof PlantNotFoundError || error instanceof AreaNotFoundError) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof BadRequestException ||
        error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Failed to create pot');
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
      const imageUrl = await this.gardenImageService.uploadPotImage(file);
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
  async getPots(@Request() req, @Query() filter: PotFilterDto) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }
      return await this.getPotsUseCase.execute(userId, filter);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve pots');
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getPot(@Request() req, @Param('id') id: string) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }
      if (!id?.trim()) {
        throw new BadRequestException('Pot ID is required');
      }
      return await this.getPotUseCase.execute(userId, id);
    } catch (error) {
      if (error instanceof PotNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof PotNotOwnedError) {
        throw new ForbiddenException(error.message);
      }
      if (error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve pot');
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updatePot(
    @Request() req,
    @Param('id') id: string,
    @Body() updatePotDto: UpdatePotDto,
  ) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }
      if (!id?.trim()) {
        throw new BadRequestException('Pot ID is required');
      }
      return await this.updatePotUseCase.execute(userId, id, updatePotDto);
    } catch (error) {
      if (error instanceof PotNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof PotNotOwnedError) {
        throw new ForbiddenException(error.message);
      }
      if (error instanceof InvalidPotStateError) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof DuplicatePotNameError) {
        throw new ConflictException(error.message);
      }
      if (error instanceof PlantNotFoundError || error instanceof AreaNotFoundError) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Failed to update pot');
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
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }
      if (!id?.trim()) {
        throw new BadRequestException('Pot ID is required');
      }

      const pot = await this.getPotUseCase.execute(userId, id);

      if (pot.image_url) {
        await this.gardenImageService.updateImage(pot.image_url, file);
        return { id: pot.id };
      } else {
        const imageUrl = await this.gardenImageService.uploadPotImage(file);
        if (!imageUrl) {
          throw new BadRequestException('Failed to upload image');
        }
        const result = await this.updatePotUseCase.execute(userId, id, { image_url: imageUrl });
        return result;
      }
    } catch (error) {
      if (error instanceof PotNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof PotNotOwnedError) {
        throw new ForbiddenException(error.message);
      }
      if (error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException('Failed to update pot image');
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePot(@Request() req, @Param('id') id: string) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }
      if (!id?.trim()) {
        throw new BadRequestException('Pot ID is required');
      }
      await this.deletePotUseCase.execute(userId, id);
    } catch (error) {
      if (error instanceof PotNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof PotNotOwnedError) {
        throw new ForbiddenException(error.message);
      }
      if (error instanceof InvalidPotStateError) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete pot');
    }
  }

  @Delete(':id/image')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteImage(@Request() req, @Param('id') id: string) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }
      if (!id?.trim()) {
        throw new BadRequestException('Pot ID is required');
      }

      const pot = await this.getPotUseCase.execute(userId, id);

      if (!pot.image_url) {
        throw new BadRequestException('This pot does not have an image to delete');
      }

      await this.gardenImageService.deleteImage(pot.image_url);
      await this.updatePotUseCase.execute(userId, id, { image_url: '' });
    } catch (error) {
      if (error instanceof PotNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof PotNotOwnedError) {
        throw new ForbiddenException(error.message);
      }
      if (error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete pot image');
    }
  }
}
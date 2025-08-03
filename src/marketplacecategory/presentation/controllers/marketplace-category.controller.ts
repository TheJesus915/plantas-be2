import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Param,
  Query,
  Body,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  HttpCode,
  UseGuards
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateMarketplaceCategoryUseCase } from '../../application/use-cases/create-marketplace-category.use-case';
import { UploadMarketplaceCategoryImageUseCase } from '../../application/use-cases/upload-marketplace-category-image.use-case';
import { UpdateMarketplaceCategoryUseCase } from '../../application/use-cases/update-marketplace-category.use-case';
import { UpdateMarketplaceCategoryImageUseCase } from '../../application/use-cases/update-marketplace-category-image.use-case';
import { DeleteMarketplaceCategoryImageUseCase } from '../../application/use-cases/delete-marketplace-category-image.use-case';
import { GetMarketplaceCategoriesUseCase } from '../../application/use-cases/get-marketplace-categories.use-case';
import { GetMarketplaceCategoriesMobileUseCase } from '../../application/use-cases/get-marketplace-categories-mobile.use-case';
import { CreateMarketplaceCategoryDto } from '../../application/dtos/create-marketplace-category.dto';
import { UpdateMarketplaceCategoryDto } from '../../application/dtos/update-marketplace-category.dto';
import { GetMarketplaceCategoriesQueryDto } from '../../application/dtos/get-marketplace-categories-query.dto';
import { JwtAuthGuard } from '../../../shared/infrastructure/guards/jwt-auth.guard';
import { ModulePermissionGuard, RequirePermission } from '../../../shared/infrastructure/guards/module-permission.guard';
import { PermissionAction } from '@prisma/client';

@Controller('marketplace/categories')
@UseGuards(JwtAuthGuard, ModulePermissionGuard)
export class MarketplaceCategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateMarketplaceCategoryUseCase,
    private readonly uploadImageUseCase: UploadMarketplaceCategoryImageUseCase,
    private readonly updateCategoryUseCase: UpdateMarketplaceCategoryUseCase,
    private readonly updateCategoryImageUseCase: UpdateMarketplaceCategoryImageUseCase,
    private readonly deleteCategoryImageUseCase: DeleteMarketplaceCategoryImageUseCase,
    private readonly getCategoriesUseCase: GetMarketplaceCategoriesUseCase,
    private readonly getCategoriesMobileUseCase: GetMarketplaceCategoriesMobileUseCase
  ) {}

  @Get()
  @RequirePermission('marketplace', PermissionAction.READ)
  async getCategories(@Query() query: GetMarketplaceCategoriesQueryDto) {
    return await this.getCategoriesUseCase.execute(query);
  }

  @Get('mobile')
  @UseGuards(JwtAuthGuard)
  async getCategoriesMobile(@Query() query: GetMarketplaceCategoriesQueryDto) {
    return await this.getCategoriesMobileUseCase.execute(query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermission('marketplace', PermissionAction.CREATE)
  async create(@Body() dto: CreateMarketplaceCategoryDto) {
    const category = await this.createCategoryUseCase.execute(dto);
    return { id: category.id };
  }

  @Post('upload-image')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image'))
  @RequirePermission('marketplace', PermissionAction.CREATE)
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const imageUrl = await this.uploadImageUseCase.execute(file);
    return { url: imageUrl };
  }

  @Put(':id')
  @RequirePermission('marketplace', PermissionAction.UPDATE)
  async update(@Param('id') id: string, @Body() dto: UpdateMarketplaceCategoryDto) {
    const category = await this.updateCategoryUseCase.execute(id, dto);
    return { id: category.id };
  }

  @Put(':id/image')
  @UseInterceptors(FileInterceptor('image'))
  @RequirePermission('marketplace', PermissionAction.UPDATE)
  async updateImage(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    const category = await this.updateCategoryImageUseCase.execute(id, file);
    return { id: category.id };
  }

  @Delete(':id/image')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('marketplace', PermissionAction.DELETE)
  async deleteImage(@Param('id') id: string): Promise<void> {
    await this.deleteCategoryImageUseCase.execute(id);
  }
}

import {
    Controller,
    Post,
    Body,
    HttpException,
    HttpStatus,
    Get,
    UseGuards,
    Req,
    Put,
    Delete,
    UseInterceptors,
    UploadedFile,
    BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateProfileDto } from '../../application/dtos/User/update-profile.dto';
import { ChangePasswordDto } from '../../application/dtos/User/change-password.dto';
import { RequestEmailChangeDto } from '../../application/dtos/User/request-email-change.dto';
import { VerifyEmailChangeDto } from '../../application/dtos/User/verify-email-change.dto';
import { GetProfileUseCase } from '../../application/use-cases/User/get-profile.use-case';
import { UpdateProfileUseCase } from '../../application/use-cases/User/update-profile.use-case';
import { ChangePasswordUseCase } from '../../application/use-cases/User/change-password.use-case';
import { RequestEmailChangeUseCase } from '../../application/use-cases/User/request-email-change.use-case';
import { VerifyEmailChangeUseCase } from '../../application/use-cases/User/verify-email-change.use-case';
import { DeactivateUserUseCase } from '../../application/use-cases/User/deactivate-user.use-case';
import { UploadProfilePhotoUseCase } from '../../application/use-cases/User/upload-profile-photo.use-case';
import { DeleteProfilePhotoUseCase } from '../../application/use-cases/User/delete-profile-photo.use-case';
import { JwtAuthGuard } from '../../../shared/infrastructure/guards/jwt-auth.guard';
import { Request } from 'express';
import { GetAdminProfileUseCase } from '../../application/use-cases/User/get-admin-profile.use-case';
import { AdminProfileDto } from '../../application/dtos/User/admin-profile.dto';

interface RequestWithUser extends Request {
    user: {
        sub: string;
        name: string;
        type: string;
        email: string;
        status: string;
        iat?: number;
        exp?: number;
    }
}


@Controller('profile-management')
export class UserController {
    constructor(
      private readonly getProfileUseCase: GetProfileUseCase,
      private readonly updateProfileUseCase: UpdateProfileUseCase,
      private readonly changePasswordUseCase: ChangePasswordUseCase,
      private readonly requestEmailChangeUseCase: RequestEmailChangeUseCase,
      private readonly verifyEmailChangeUseCase: VerifyEmailChangeUseCase,
      private readonly deactivateUserUseCase: DeactivateUserUseCase,
      private readonly uploadProfilePhotoUseCase: UploadProfilePhotoUseCase,
      private readonly deleteProfilePhotoUseCase: DeleteProfilePhotoUseCase,
      private readonly getAdminProfileUseCase: GetAdminProfileUseCase,
    ) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async getProfile(@Req() request: RequestWithUser) {
        try {
            const userId = request.user.sub;
            return await this.getProfileUseCase.execute(userId);
        } catch (error) {
            throw new HttpException(
              error.message,
              error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    async updateProfile(@Req() request: RequestWithUser, @Body() updateData: UpdateProfileDto) {
        try {
            const userId = request.user.sub;
            return await this.updateProfileUseCase.execute(userId, updateData);
        } catch (error) {
            throw new HttpException(
              error.message,
              error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Put('change-password')
    @UseGuards(JwtAuthGuard)
    async changePassword(@Req() request: RequestWithUser, @Body() changePasswordDto: ChangePasswordDto) {
        try {
            const userId = request.user.sub;
            return await this.changePasswordUseCase.execute(userId, changePasswordDto);
        } catch (error) {
            throw new HttpException(
              error.message,
              error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post('request-email-change')
    @UseGuards(JwtAuthGuard)
    async requestEmailChange(@Req() request: RequestWithUser, @Body() requestEmailChangeDto: RequestEmailChangeDto) {
        try {
            const userId = request.user.sub;
            return await this.requestEmailChangeUseCase.execute(userId, requestEmailChangeDto);
        } catch (error) {
            throw new HttpException(
              error.message,
              error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post('verify-email-change')
    @UseGuards(JwtAuthGuard)
    async verifyEmailChange(@Req() request: RequestWithUser, @Body() verifyEmailChangeDto: VerifyEmailChangeDto) {
        try {
            const userId = request.user.sub;
            return await this.verifyEmailChangeUseCase.execute(userId, verifyEmailChangeDto);
        } catch (error) {
            throw new HttpException(
              error.message,
              error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Delete('deactivate')
    @UseGuards(JwtAuthGuard)
    async deactivateAccount(@Req() request: RequestWithUser) {
        try {
            const userId = request.user.sub;
            await this.deactivateUserUseCase.execute(userId);
        } catch (error) {
            throw new HttpException(
              error.message,
              error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post('profile/photo')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
      FileInterceptor('photo', {
          limits: {
              fileSize: 5 * 1024 * 1024, // 5MB
          },
          fileFilter: (req, file, callback) => {
              if (!file.mimetype.match(/image\/(jpeg|jpg|png|webp)/)) {
                  return callback(
                    new BadRequestException('Only image files are allowed'),
                    false,
                  );
              }
              callback(null, true);
          },
      }),
    )
    async uploadProfilePhoto(@UploadedFile() file: Express.Multer.File, @Req() request: RequestWithUser) {
        try {
            if (!file) {
                throw new BadRequestException('File is required');
            }

            const userId = request.user.sub;
            const id = await this.uploadProfilePhotoUseCase.execute(userId, file.buffer);

            return { id };
        } catch (error) {
            throw new HttpException(
              error.message,
              error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Delete('profile/photo')
    @UseGuards(JwtAuthGuard)
    async deleteProfilePhoto(@Req() request: RequestWithUser) {
        try {
            const userId = request.user.sub;
            const id = await this.deleteProfilePhotoUseCase.execute(userId);
        } catch (error) {
            throw new HttpException(
              error.message,
              error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('admin')
    async getAdminProfile(@Req() req: RequestWithUser): Promise<AdminProfileDto> {
      const userId = req.user.sub;
      return await this.getAdminProfileUseCase.execute(userId);
    }
}
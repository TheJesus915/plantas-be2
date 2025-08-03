import { Module } from '@nestjs/common';
import { FaqNodeController } from './presentation/controllers/faq-node.controller';
import { CreateFaqNodeUseCase } from './application/use-cases/create-faq-node.use-case';
import { UpdateFaqNodeUseCase } from './application/use-cases/update-faq-node.use-case';
import { DeleteFaqNodeUseCase } from './application/use-cases/delete-faq-node.use-case';
import { GetFaqNodesUseCase } from './application/use-cases/get-faq-nodes.use-case';
import { FaqsRepository } from './infrastructure/repositories/faqs.repository';
import { PrismaService } from '../shared/infrastructure/services/prisma.service';
import { PaginationService } from '../shared/infrastructure/services/pagination.service';
import { UploadFaqImageUseCase } from './application/use-cases/upload-faq-image.usecase';
import { DeleteFaqImageUseCase } from './application/use-cases/delete-faq-image.usecase';
import {FaqImagesService} from './infrastructure/services/faq-images.service';

@Module({
  controllers: [FaqNodeController],
  providers: [
    CreateFaqNodeUseCase,
    UpdateFaqNodeUseCase,
    DeleteFaqNodeUseCase,
    GetFaqNodesUseCase,
    UploadFaqImageUseCase,
    DeleteFaqImageUseCase,
    FaqImagesService,
    {
      provide: 'IFaqNodeRepository',
      useClass: FaqsRepository,
    },
    PrismaService,
    PaginationService,
  ],
})
export class FaqsModule {}

import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { TaxonomyController } from './presentation/controllers/taxonomy.controller';
import { TaxonomyRepository } from './infrastructure/repositories/taxonomy.repository';
import { CreateTaxonomicNodeUseCase } from './application/use-cases/create-taxonomic-node.use-case';
import { GetTaxonomicNodesUseCase } from './application/use-cases/get-taxonomic-nodes.use-case';
import { DeleteTaxonomicNodeUseCase } from './application/use-cases/delete-taxonomic-node.use-case';
import { UpdateTaxonomicNodeUseCase } from './application/use-cases/update-taxonomic-node.use-case';
import { GetTaxonomicAncestryUseCase } from './application/use-cases/get-taxonomic-ancestry.use-case';

@Module({
  imports: [SharedModule],
  controllers: [TaxonomyController],
  providers: [
    {
      provide: 'ITaxonomyRepository',
      useClass: TaxonomyRepository,
    },
    CreateTaxonomicNodeUseCase,
    GetTaxonomicNodesUseCase,
    DeleteTaxonomicNodeUseCase,
    UpdateTaxonomicNodeUseCase,
    GetTaxonomicAncestryUseCase,
  ],
  exports: [
    'ITaxonomyRepository',
    CreateTaxonomicNodeUseCase,
    GetTaxonomicNodesUseCase,
    DeleteTaxonomicNodeUseCase,
    UpdateTaxonomicNodeUseCase,
    GetTaxonomicAncestryUseCase,
  ],
})
export class TaxonomyModule {}

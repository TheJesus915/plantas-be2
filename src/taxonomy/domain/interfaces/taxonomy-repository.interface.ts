import { TaxonomicNode, TaxonomicRank } from '../entities/taxonomic-node.entity';

export interface ITaxonomyRepository {
  createTaxonomicNode(node: TaxonomicNode): Promise<TaxonomicNode>;

  findTaxonomicNodeById(id: string): Promise<TaxonomicNode | null>;

  findTaxonomicNodesByRank(rank: TaxonomicRank): Promise<TaxonomicNode[]>;

  findTaxonomicNodesByParentId(parentId: string): Promise<TaxonomicNode[]>;

  findTaxonomicNodesByRankAndParentId(
    rank: TaxonomicRank,
    parentId?: string
  ): Promise<TaxonomicNode[]>;

  updateTaxonomicNode(
    id: string,
    data: Partial<TaxonomicNode>
  ): Promise<TaxonomicNode>;

  deleteTaxonomicNode(id: string): Promise<boolean>;

  getAncestry(nodeId: string): Promise<TaxonomicNode[]>;

  existsNodeWithName(
    name: string,
    rank: TaxonomicRank,
    parentId?: string
  ): Promise<boolean>;

  hasRelatedCatalogPlants(id: string): Promise<boolean>;

  hasDescendantWithCatalogPlants(id: string): Promise<boolean>;
}

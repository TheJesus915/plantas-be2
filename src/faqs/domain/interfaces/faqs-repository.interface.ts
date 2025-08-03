import { FaqNode, FaqNodeType } from '../entities/faq-node.entity';
import { PaginationFilterDto } from '../../../shared/application/dtos/pagination.dto';

export interface IFaqsRepository {
  createFaqNode(node: FaqNode): Promise<FaqNode>;

  findFaqNodeById(id: string): Promise<FaqNode | null>;

  findFaqNodesByType(type: FaqNodeType): Promise<FaqNode[]>;

  findFaqNodesByParentId(parentId: string | null, withChildren?: boolean): Promise<FaqNode[]>;

  findFaqNodesByTypeAndParentId(
    type: FaqNodeType,
    parentId?: string
  ): Promise<FaqNode[]>;

  updateFaqNode(
    id: string,
    data: Partial<FaqNode>
  ): Promise<FaqNode>;

  deleteFaqNode(id: string): Promise<boolean>;

  getAncestry(nodeId: string): Promise<FaqNode[]>;

  existsNodeWithContent(
    content: Record<string, any>,
    parentId?: string
  ): Promise<boolean>;

  /**
   * Retorna true si existe al menos un nodo principal (sin parentId)
   */
  existsNodeWithNoParent(): Promise<boolean>;

  findFaqNodesWithPagination(
    filter: PaginationFilterDto,
    type?: FaqNodeType,
    parentId?: string,
    withChildren?: boolean
  ): Promise<{ nodes: FaqNode[]; total: number }>;
}

import { FaqNode, FaqNodeType } from '../../domain/entities/faq-node.entity';

export class FaqNodeMapper {
  static toDomain(raw: any): FaqNode {
    const hasChildren = raw.children && raw.children.length > 0;

    return new FaqNode({
      id: raw.id,
      parentId: raw.parentId ?? undefined,
      type: raw.type as FaqNodeType,
      content: raw.content,
      createdAt: raw.createdAt,
      withchildren: hasChildren
    });
  }

  static toPrisma(entity: Partial<FaqNode>): any {
    return {
      id: entity.id,
      parentId: entity.parentId || null,
      type: entity.type,
      content: entity.content,
      createdAt: entity.createdAt,
    };
  }
}

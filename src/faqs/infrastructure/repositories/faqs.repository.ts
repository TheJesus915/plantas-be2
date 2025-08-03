import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/services/prisma.service';
import { IFaqsRepository } from '../../domain/interfaces/faqs-repository.interface';
import { FaqNode, FaqNodeType } from '../../domain/entities/faq-node.entity';
import { PaginationFilterDto } from '../../../shared/application/dtos/pagination.dto';
import { FaqNodeMapper } from '../mappers/faq-node.mapper';

@Injectable()
export class FaqsRepository implements IFaqsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createFaqNode(node: FaqNode): Promise<FaqNode> {
    const prismaData = FaqNodeMapper.toPrisma(node);
    const created = await this.prisma.faqNode.create({
      data: prismaData,
    });

    return FaqNodeMapper.toDomain(created);
  }

  async findFaqNodeById(id: string): Promise<FaqNode | null> {
    const node = await this.prisma.faqNode.findUnique({
      where: { id },
      include: {
        children: true,
      },
    });

    return node ? FaqNodeMapper.toDomain(node) : null;
  }

  async findFaqNodesByType(type: FaqNodeType): Promise<FaqNode[]> {
    const nodes = await this.prisma.faqNode.findMany({
      where: { type },
      include: {
        children: true,
      },
    });

    return nodes.map((node) => FaqNodeMapper.toDomain(node));
  }

  async findFaqNodesByParentId(parentId: string | null, withChildren: boolean = false): Promise<FaqNode[]> {
    const nodes = await this.prisma.faqNode.findMany({
      where: { parentId },
      include: {
        children: withChildren,
      },
    });

    return nodes.map((node) => FaqNodeMapper.toDomain(node));
  }

  async findFaqNodesByTypeAndParentId(
    type: FaqNodeType,
    parentId?: string,
  ): Promise<FaqNode[]> {
    const nodes = await this.prisma.faqNode.findMany({
      where: {
        type,
        parentId: parentId || null,
      },
      include: {
        children: true,
      },
    });

    return nodes.map((node) => FaqNodeMapper.toDomain(node));
  }

  async updateFaqNode(id: string, data: Partial<FaqNode>): Promise<FaqNode> {
    const updateData: any = {};
    if (data.content !== undefined) {
      updateData.content = data.content;
    }

    const updated = await this.prisma.faqNode.update({
      where: { id },
      data: updateData,
      include: {
        children: true,
      },
    });

    return FaqNodeMapper.toDomain(updated);
  }

  async deleteFaqNode(id: string): Promise<boolean> {
    await this.prisma.faqNode.delete({ where: { id } });
    return true;
  }

  async getAncestry(nodeId: string): Promise<FaqNode[]> {
    const nodes: FaqNode[] = [];
    let currentNode = await this.findFaqNodeById(nodeId);

    while (currentNode?.parentId) {
      const parent = await this.findFaqNodeById(currentNode.parentId);
      if (parent) {
        nodes.push(parent);
        currentNode = parent;
      } else {
        break;
      }
    }

    return nodes;
  }

  async existsNodeWithContent(
    content: Record<string, any>,
    type: FaqNodeType,
    parentId?: string,
  ): Promise<boolean> {
    const contentString = JSON.stringify(content);

    const nodes = await this.prisma.faqNode.findMany({
      where: {
        type,
        parentId: parentId || null,
      },
    });

    const exists = nodes.some((node) => {
      const nodeContentString = JSON.stringify(node.content);
      return nodeContentString === contentString;
    });

    return exists;
  }

  async existsNodeWithNoParent(): Promise<boolean> {
    const count = await this.prisma.faqNode.count({
      where: { parentId: null },
    });
    return count > 0;
  }

  async findFaqNodesWithPagination(
    filter: PaginationFilterDto,
    type?: FaqNodeType,
    parentId?: string,
    withChildren: boolean = false
  ): Promise<{ nodes: FaqNode[]; total: number }> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } =
      filter;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (type) where.type = type;
    if (parentId !== undefined) where.parentId = parentId || null;
    else where.parentId = null;

    if (search) {
      where.OR = [
        {
          content: {
            path: ['question'],
            string_contains: search,
            mode: 'insensitive',
          },
        },
        {
          content: {
            path: ['answer'],
            string_contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [prismaNodes, total] = await Promise.all([
      this.prisma.faqNode.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: { children: withChildren },
      }),
      this.prisma.faqNode.count({ where }),
    ]);

    const nodes = prismaNodes.map((node) => FaqNodeMapper.toDomain(node));
    return { nodes, total };
  }
}

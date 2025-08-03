import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/services/prisma.service';
import { Prisma } from '@prisma/client';
import { TaxonomicNode, TaxonomicRank } from '../../domain/entities/taxonomic-node.entity';
import { ITaxonomyRepository } from '../../domain/interfaces/taxonomy-repository.interface';

@Injectable()
export class TaxonomyRepository implements ITaxonomyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createTaxonomicNode(node: TaxonomicNode): Promise<TaxonomicNode> {
    const createdNode = await this.prisma.taxonomicNode.create({
      data: {
        name: node.name,
        rank: node.rank,
        parentId: node.parentId,
      },
    });

    return new TaxonomicNode({
      id: createdNode.id,
      name: createdNode.name,
      rank: createdNode.rank as TaxonomicRank,
      parentId: createdNode.parentId || undefined,
      createdAt: createdNode.createdAt,
    });
  }

  async findTaxonomicNodeById(id: string): Promise<TaxonomicNode | null> {
    const node = await this.prisma.taxonomicNode.findUnique({
      where: { id },
    });

    if (!node) return null;

    return new TaxonomicNode({
      id: node.id,
      name: node.name,
      rank: node.rank as TaxonomicRank,
      parentId: node.parentId || undefined,
      createdAt: node.createdAt,
    });
  }

  async findTaxonomicNodesByRank(rank: TaxonomicRank): Promise<TaxonomicNode[]> {
    const nodes = await this.prisma.taxonomicNode.findMany({
      where: { rank },
    });

    return nodes.map(
      (node) =>
        new TaxonomicNode({
          id: node.id,
          name: node.name,
          rank: node.rank as TaxonomicRank,
          parentId: node.parentId || undefined,
          createdAt: node.createdAt,
        }),
    );
  }

  async findTaxonomicNodesByParentId(parentId: string): Promise<TaxonomicNode[]> {
    const nodes = await this.prisma.taxonomicNode.findMany({
      where: { parentId },
    });

    return nodes.map(
      (node) =>
        new TaxonomicNode({
          id: node.id,
          name: node.name,
          rank: node.rank as TaxonomicRank,
          parentId: node.parentId || undefined,
          createdAt: node.createdAt,
        }),
    );
  }

  async findTaxonomicNodesByRankAndParentId(
    rank: TaxonomicRank,
    parentId?: string,
  ): Promise<TaxonomicNode[]> {
    const nodes = await this.prisma.taxonomicNode.findMany({
      where: {
        rank,
        parentId: parentId || null,
      },
    });

    return nodes.map(
      (node) =>
        new TaxonomicNode({
          id: node.id,
          name: node.name,
          rank: node.rank as TaxonomicRank,
          parentId: node.parentId || undefined,
          createdAt: node.createdAt,
        }),
    );
  }

  async updateTaxonomicNode(
    id: string,
    data: Partial<TaxonomicNode>,
  ): Promise<TaxonomicNode> {
    const updatedNode = await this.prisma.taxonomicNode.update({
      where: { id },
      data: {
        name: data.name,
      },
    });

    return new TaxonomicNode({
      id: updatedNode.id,
      name: updatedNode.name,
      rank: updatedNode.rank as TaxonomicRank,
      parentId: updatedNode.parentId || undefined,
      createdAt: updatedNode.createdAt,
    });
  }

  async deleteTaxonomicNode(id: string): Promise<boolean> {
    await this.prisma.taxonomicNode.delete({
      where: { id },
    });
    return true;
  }

  async getAncestry(nodeId: string): Promise<TaxonomicNode[]> {
    const result: TaxonomicNode[] = [];
    let currentNodeId = nodeId;

    while (currentNodeId) {
      const node = await this.prisma.taxonomicNode.findUnique({
        where: { id: currentNodeId },
      });

      if (!node) break;

      result.push(
        new TaxonomicNode({
          id: node.id,
          name: node.name,
          rank: node.rank as TaxonomicRank,
          parentId: node.parentId || undefined,
          createdAt: node.createdAt,
        }),
      );

      if (!node.parentId) break;
      currentNodeId = node.parentId;
    }

    return result.reverse();
  }

  async existsNodeWithName(
    name: string,
    rank: TaxonomicRank,
    parentId?: string,
  ): Promise<boolean> {
    const count = await this.prisma.taxonomicNode.count({
      where: {
        name,
        rank,
        parentId: parentId || null,
      },
    });

    return count > 0;
  }

  async hasRelatedCatalogPlants(id: string): Promise<boolean> {
    const count = await this.prisma.catalogplant.count({
      where: { taxonomicNodeId: id },
    });

    return count > 0;
  }

  async hasDescendantWithCatalogPlants(id: string): Promise<boolean> {
    const descendants = await this.prisma.$queryRaw<{ taxonomic_node_id: string }[]>(
      Prisma.sql`
        WITH RECURSIVE descendants AS (
          SELECT taxonomic_node_id FROM taxonomic_nodes WHERE taxonomic_node_id = ${id}
          UNION ALL
          SELECT tn.taxonomic_node_id FROM taxonomic_nodes tn
          INNER JOIN descendants d ON tn.parent_id = d.taxonomic_node_id
        )
        SELECT taxonomic_node_id FROM descendants;
      `
    );
    const descendantIds = Array.isArray(descendants) ? descendants.map((descendant) => descendant.taxonomic_node_id) : [];
    if (descendantIds.length === 0) return false;
    const count = await this.prisma.catalogplant.count({
      where: { taxonomicNodeId: { in: descendantIds } },
    });
    return count > 0;
  }
}

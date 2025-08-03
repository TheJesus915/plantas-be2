export enum TaxonomicRank {
  DOMAIN = 'DOMAIN',
  KINGDOM = 'KINGDOM',
  SUBKINGDOM = 'SUBKINGDOM',
  DIVISION = 'DIVISION',
  SUBDIVISION = 'SUBDIVISION',
  SUPERCLASS = 'SUPERCLASS',
  CLASS = 'CLASS',
  SUBCLASS = 'SUBCLASS',
  ORDER = 'ORDER',
  SUBORDER = 'SUBORDER',
  FAMILY = 'FAMILY',
  SUBFAMILY = 'SUBFAMILY',
  TRIBE = 'TRIBE',
  SUBTRIBE = 'SUBTRIBE',
  GENUS = 'GENUS',
  SUBGENUS = 'SUBGENUS',
  SECTION = 'SECTION',
  SPECIES = 'SPECIES',
}

export class TaxonomicNode {
  id: string;
  name: string;
  rank: TaxonomicRank;
  parentId?: string;
  createdAt: Date;

  constructor(partial: Partial<TaxonomicNode>) {
    Object.assign(this, partial);
  }
}

export const TAXONOMIC_RANK_ORDER = [
  TaxonomicRank.DOMAIN,
  TaxonomicRank.KINGDOM,
  TaxonomicRank.SUBKINGDOM,
  TaxonomicRank.DIVISION,
  TaxonomicRank.SUBDIVISION,
  TaxonomicRank.SUPERCLASS,
  TaxonomicRank.CLASS,
  TaxonomicRank.SUBCLASS,
  TaxonomicRank.ORDER,
  TaxonomicRank.SUBORDER,
  TaxonomicRank.FAMILY,
  TaxonomicRank.SUBFAMILY,
  TaxonomicRank.TRIBE,
  TaxonomicRank.SUBTRIBE,
  TaxonomicRank.GENUS,
  TaxonomicRank.SUBGENUS,
  TaxonomicRank.SECTION,
  TaxonomicRank.SPECIES,
];

export function getNextTaxonomicRank(rank: TaxonomicRank): TaxonomicRank | null {
  const currentIndex = TAXONOMIC_RANK_ORDER.indexOf(rank);
  if (currentIndex < 0 || currentIndex === TAXONOMIC_RANK_ORDER.length - 1) {
    return null;
  }
  return TAXONOMIC_RANK_ORDER[currentIndex + 1];
}

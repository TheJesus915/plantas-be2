export enum FaqNodeType {
  PREGUNTA = 'pregunta',
  RESPUESTA = 'respuesta',
}

export class FaqNode {
  id: string;
  parentId?: string;
  type: FaqNodeType;
  content: Record<string, any>;
  createdAt: Date;
  withchildren?: boolean;

  constructor(partial: Partial<FaqNode>) {
    Object.assign(this, partial);
  }
}

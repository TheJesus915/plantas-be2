export interface ILinkingKeyService {
  ensureUnique(): Promise<string>;
}
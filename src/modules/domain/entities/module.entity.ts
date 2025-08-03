export class ModuleEntity {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdDate: Date;

  static create(data: {
    name: string;
    description?: string;
  }): ModuleEntity {
    const module = new ModuleEntity();
    module.name = data.name.toLowerCase().trim();
    module.description = data.description?.trim() || null;
    module.isActive = true;
    return module;
  }

  static fromPersistence(data: any): ModuleEntity {
    const module = new ModuleEntity();
    module.id = data.id;
    module.name = data.name;
    module.description = data.description;
    module.isActive = data.isActive;
    module.createdDate = data.createdDate;
    return module;
  }

  update(name?: string, description?: string, isActive?: boolean): ModuleEntity {
    const module = new ModuleEntity();
    module.id = this.id;
    module.name = name !== undefined ? name.toLowerCase().trim() : this.name;
    module.description = description !== undefined ? description?.trim() || null : this.description;
    module.isActive = isActive !== undefined ? isActive : this.isActive;
    module.createdDate = this.createdDate;
    return module;
  }

  deactivate(): ModuleEntity {
    return this.update(undefined, undefined, false);
  }

  activate(): ModuleEntity {
    return this.update(undefined, undefined, true);
  }
}
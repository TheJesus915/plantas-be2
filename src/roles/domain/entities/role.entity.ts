export class Role {
    constructor(
      public readonly id: string,
      public readonly name: string,
      public readonly description: string | null,
      public readonly is_active: boolean,
      public readonly createdDate: Date,
      public readonly permissions: RolePermission[],
      public readonly userCount: number = 0
    ) {}

}

export class RolePermission {
    constructor(
      public readonly moduleId: string,
      public readonly moduleName: string,
      public readonly permissions: string[]
    ) {}
}
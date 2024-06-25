export interface IRoleResourceRepository {
    getResource(roleId: number, resource: String): Promise<any>;
}

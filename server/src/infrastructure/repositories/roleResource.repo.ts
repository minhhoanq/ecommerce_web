import { injectable } from "inversify";
import { IRoleResourceRepository } from "../../domain/repositories/roleResource.interface";
import { PrismaClient } from "@prisma/client";

@injectable()
export class RoleResourceRepoImpl implements IRoleResourceRepository {
    private _prisma: PrismaClient;

    constructor() {
        this._prisma = new PrismaClient();
    }

    async getResource(roleId: number, resource: string): Promise<any> {
        return await this._prisma
            .$queryRaw`SELECT r.name, rs.code, rr.action, rr.attributes FROM "roleResources" as rr
        JOIN "roles" as r on rr."roleId" = r.id
        JOIN "resources" as rs on rr."resourceId" = rs.id
        WHERE r.id = ${roleId} and rs.code = '${resource}'
        `;
    }
}

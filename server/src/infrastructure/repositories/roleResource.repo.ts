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
        // console.log(typeof roleId + " | " + typeof resource);
        const access: [
            { name: string; code: string; action: string; attributes: string }
        ] = await this._prisma
            .$queryRaw`SELECT r.name, rs.code, rr.action, rr.attributes FROM "roleResources" as rr
        JOIN "roles" as r on rr."roleId" = r.id
        JOIN "resources" as rs on rr."resourceId" = rs.id
        WHERE r.id = ${roleId} and rs.code = ${resource}
        `;

        const grantList: any[] = [];
        // console.log("a", access);
        access.map((item) => {
            return grantList.push({
                role: item.name,
                resource: item.code,
                action: item.action,
                attributes: item.attributes,
            });
        });

        return { grantList: grantList, roleName: access[0]?.name };
    }
}

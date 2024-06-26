import { NextFunction, Request, Response } from "express";
import { AccessControl, Permission } from "accesscontrol";
import "reflect-metadata";
import { inject, injectable } from "inversify";
import { TYPES } from "../../shared/constants/types";
import { IRoleResourceRepository } from "../../domain/repositories/roleResource.interface";
import { AuthFailureError } from "../../shared/core/error.response";

/**
 *
 * @param action
 * @param resource
 * @returns
 */
@injectable()
export class Access {
    private _RResourceRepo: IRoleResourceRepository;
    constructor(
        @inject(TYPES.RoleResourceRepository)
        RResourceRepo: IRoleResourceRepository
    ) {
        this._RResourceRepo = RResourceRepo;
    }

    GrantAccess = (action: string, resource: string) => {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                // console.log(req.user.roleId + " | " + resource);
                const access = await this._RResourceRepo.getResource(
                    req.user.roleId,
                    resource
                );

                // console.log("access: ", access);
                if (!access.roleName)
                    return res.json("You dont have enough permissions");

                const ac = new AccessControl(access.grantList);
                const permissions = ac.can(access.roleName);
                const isPermitted = permissions[
                    action as keyof typeof permissions
                ](resource) as Permission;

                // const permissions = ac.;
                // console.log("check 3", isPermitted.granted);
                if (!isPermitted.granted) {
                    return res.json("You dont have enough permissions");
                }
                next();
            } catch (error) {
                console.log(error);
            }
        };
    };
}

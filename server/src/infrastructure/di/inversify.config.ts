import { Container } from "inversify";
import { IUserRepository } from "../../domain/repositories/user.interface";
import { TYPES } from "../../shared/constants/types";
import UserRepoImpl from "../repositories/user.repo";
import IAuthService from "../../application/usecases/auth/auth.interface";
import { AuthService } from "../../application/usecases/auth/auth.service";
import AuthController from "../../presentation/controllers/auth.controller";
import { IKeyStoreRepository } from "../../domain/repositories/keyStore.interface";
import { KeyStoreRepoImpl } from "../repositories/keyStore.repo";
import { IKeyStoreService } from "../../application/usecases/keystore/keystore.interface";
import { KeyStoreService } from "../../application/usecases/keystore/keystrore.service";
import { IRoleResourceRepository } from "../../domain/repositories/roleResource.interface";
import { RoleResourceRepoImpl } from "../repositories/roleResource.repo";
import { Auth } from "../../presentation/auth/auth.util";
import { Access } from "../../presentation/auth/rbac";

const container = new Container();

container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepoImpl);
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind(TYPES.AuthController).to(AuthController);
//key store
container
    .bind<IKeyStoreRepository>(TYPES.KeyStoreRepository)
    .to(KeyStoreRepoImpl);
container.bind<IKeyStoreService>(TYPES.KeyStoreService).to(KeyStoreService);
//
container
    .bind<IRoleResourceRepository>(TYPES.RoleResourceRepository)
    .to(RoleResourceRepoImpl);
container.bind(TYPES.Auth).to(Auth);
//
container.bind(TYPES.Access).to(Access);
export { container };

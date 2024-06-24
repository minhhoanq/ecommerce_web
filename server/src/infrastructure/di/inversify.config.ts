import { Container } from "inversify";
import { IUserRepository } from "../../domain/repositories/user.interface";
import { TYPES } from "../../shared/constants/types";
import UserRepoImpl from "../repositories/user.repo";
import IAuthService from "../../application/usecases/auth/auth.interface";
import { AuthService } from "../../application/usecases/auth/auth.service";
import AuthController from "../../presentation/controllers/auth.controller";

const container = new Container();

container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepoImpl);
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind(TYPES.AuthController).to(AuthController);

export { container };

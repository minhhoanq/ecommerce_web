import User from "../entities/user";
import IBaseRepository from "./base.interface";

export interface IUserRepository extends IBaseRepository<User> {
    findByEmail(email: string): Promise<User | null>;
}

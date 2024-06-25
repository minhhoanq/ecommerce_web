import { CodeVerifyDTO, CreateUserDTO } from "../../application/dtos/user.dto";
import User from "../entities/user";
import IBaseRepository from "./base.interface";

export interface IUserRepository extends IBaseRepository<User> {
    findByEmail(email: string): Promise<User | null>;
    findByCodeVerify(codeverify: CodeVerifyDTO): Promise<User | null>;
    create(data: CreateUserDTO): Promise<User>;
    update(id: number, data: any): Promise<any>;
    findAll(): Promise<User[]>;
    findById(id: number): Promise<User | null>;
    delete(id: number): Promise<boolean>;
}

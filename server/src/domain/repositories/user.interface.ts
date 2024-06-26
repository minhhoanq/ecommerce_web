import {
    CodeVerifyDTO,
    CreateUserDTO,
    FindFirstUserDTO,
    UpdateUserDTO,
} from "../../application/dtos/user.dto";
import User from "../entities/user";
import IBaseRepository from "./base.interface";

export interface IUserRepository extends IBaseRepository<User> {
    findByEmail(email: string): Promise<User | null>;
    findByCodeVerify(codeverify: CodeVerifyDTO): Promise<User | null>;
    findById(id: number): Promise<User | null>;
    findAll(): Promise<User[]>;
    findFirst(data: FindFirstUserDTO): Promise<User | null>;
    create(data: CreateUserDTO): Promise<User>;
    update(id: number, data: UpdateUserDTO): Promise<any>;
    delete(id: number): Promise<boolean>;
    deleteByEmail(email: string): Promise<boolean>;
}

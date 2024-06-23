import User from "../../domain/entities/user";
import { IUserRepository } from "../../domain/repositories/user.interface";

export default class UserRepoImpl implements IUserRepository {
    findByEmail(email: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }
    findAll(): Promise<User[]> {
        throw new Error("Method not implemented.");
    }
    findById(id: number): Promise<User | null> {
        throw new Error("Method not implemented.");
    }
    create(): Promise<User> {
        throw new Error("Method not implemented.");
    }
    update(id: number): Promise<User> {
        throw new Error("Method not implemented.");
    }
    delete(id: number): Promise<User> {
        throw new Error("Method not implemented.");
    }
}

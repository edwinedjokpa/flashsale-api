import { Service } from "typedi";
import { ICreateUser } from "./interfaces/user.inteface";
import User, { IUser } from "./user.schema";

@Service()
export class UserModel {
  async create(data: ICreateUser): Promise<IUser> {
    return User.create(data);
  }

  async findOne(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }
}

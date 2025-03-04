import { Http } from "@status/codes";

import { HttpException } from "../common/utils/http.exception";
import { ICreateUser } from "./interface/user.inteface";
import User, { IUser } from "./user.schema";

class UserRepository {
  async create(data: ICreateUser): Promise<IUser> {
    const user = new User(data);
    return user.save();
  }

  async findOne(id: string): Promise<IUser> {
    const user = await User.findById(id);
    if (!user) {
      throw new HttpException(Http.NotFound, "User not found");
    }

    return user;
  }

  async findByEmail(email: string): Promise<IUser> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new HttpException(Http.NotFound, "User not found");
    }

    return user;
  }
}

export const userRepository = new UserRepository();

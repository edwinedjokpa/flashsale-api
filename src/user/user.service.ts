import { Http } from "@status/codes";
import { Inject, Service } from "typedi";

import { HttpException } from "../common/utils/http.exception";
import { UserModel } from "./user.model";

@Service()
export class UserService {
  constructor(@Inject() private userModel: UserModel) {}

  async dashboard(userId: string) {
    const user = await this.userModel.findOne(userId);

    if (!user) {
      throw new HttpException(Http.NotFound, "User not found");
    }
    return user;
  }
}

import { HttpException } from "common/utils/http.exception";
import { userRepository } from "./user.repository";
import { Http } from "@status/codes";

class UserService {
  async dashboard(userId: string) {
    const user = await userRepository.findOne(userId);
    return user;
  }
}

export const userService = new UserService();

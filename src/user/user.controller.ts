import { NextFunction, Response } from "express";
import { Http } from "@status/codes";

import { userService } from "./user.service";
import { createResponse } from "../common/utils/response";
import { RequestWithUser } from "./interface/user.inteface";

class UserController {
  async getDashboard(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const user = await userService.dashboard(req.user.id);

      res
        .status(Http.Ok)
        .json(
          createResponse(
            true,
            Http.Ok,
            "User dashboard data fetched successfully",
            { user }
          )
        );
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();

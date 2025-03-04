import { NextFunction, Request, Response } from "express";
import { Http } from "@status/codes";

import { authService } from "./auth.service";
import { createUserSchema, loginUserSchema } from "./dto/auth.dto";
import { createResponse } from "../common/utils/response";

class AuthController {
  // Register user
  async register(req: Request, res: Response, next: NextFunction) {
    const parseResult = createUserSchema.safeParse(req.body);

    // If validation fails, return the errors
    if (!parseResult.success) {
      return res
        .status(Http.BadRequest)
        .json(
          createResponse(
            false,
            Http.BadRequest,
            "Validation failed",
            parseResult.error.format()
          )
        );
    }

    const createUserDto = parseResult.data;

    try {
      const user = await authService.register(createUserDto);
      res.status(Http.Created).json(
        createResponse(true, Http.Created, "User registered successfully", {
          user,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Login a user
  async login(req: Request, res: Response, next: NextFunction) {
    const parseResult = loginUserSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res
        .status(Http.BadRequest)
        .json(
          createResponse(
            false,
            Http.BadRequest,
            "Validation failed",
            parseResult.error.format()
          )
        );
    }

    const loginUserDto = parseResult.data;

    try {
      const token = await authService.login(loginUserDto);
      return res
        .status(Http.Ok)
        .json(
          createResponse(true, Http.Ok, "User login successful", { token })
        );
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();

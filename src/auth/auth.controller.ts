import { NextFunction, Request, Response } from "express";
import { Http } from "@status/codes";
import { Service } from "typedi";
import { AuthService } from "./auth.service";
import { createUserSchema, loginUserSchema } from "./dto/auth.dto";
import { createResponse } from "../common/utils/response";
import catchAsync from "../common/utils/catch-async";

@Service()
export class AuthController {
  constructor(private authService: AuthService) {}

  public register = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
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

      // Proceed with the registration
      const user = await this.authService.register(createUserDto);
      return res.status(Http.Created).json(
        createResponse(true, Http.Created, "User registered successfully", {
          user,
        })
      );
    }
  );

  public login = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
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

      const token = await this.authService.login(loginUserDto);
      return res
        .status(Http.Ok)
        .json(
          createResponse(true, Http.Ok, "User login successful", { token })
        );
    }
  );
}

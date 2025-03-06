import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { Http } from "@status/codes";
import { Inject, Service } from "typedi";

import { UserModel } from "../user/user.model";
import { CreateUserDto, LoginUserDto } from "./dtos/auth.dto";
import { HttpException } from "../common/utils/http.exception";
import { JwtPayload } from "./interfaces/jwt-payload.interface";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

@Service()
export class AuthService {
  constructor(@Inject() private userModel: UserModel) {}
  async register(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const existingUser = await this.userModel.findByEmail(email);
    if (existingUser) {
      throw new HttpException(Http.Conflict, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return user;
  }

  // Login user
  async login(loginUserDto: LoginUserDto): Promise<string> {
    const { email, password } = loginUserDto;

    // Check if user exists
    const user = await this.userModel.findByEmail(email);
    if (!user) {
      throw new HttpException(Http.BadRequest, "Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new HttpException(Http.BadRequest, "Invalid credentials");
    }

    const payload: JwtPayload = {
      id: user.id as string,
      email: user.email,
    };

    // Generate JWT token
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "1hr",
    });
    return token;
  }
}

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { Http } from "@status/codes";

import { userRepository } from "../user/user.repository";
import { CreateUserDto, LoginUserDto } from "./dto/auth.dto";
import { HttpException } from "../common/utils/http.exception";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

class AuthService {
  async register(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser)
      throw new HttpException(Http.Conflict, "User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return user;
  }
  // Login user
  async login(loginUserDto: LoginUserDto): Promise<string> {
    const { email, password } = loginUserDto;

    // Check if user exists
    const user = await userRepository.findByEmail(email);
    if (!user) throw new HttpException(Http.BadRequest, "Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new HttpException(Http.BadRequest, "Invalid credentials");

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "1hr",
    });
    return token;
  }
}

export const authService = new AuthService();

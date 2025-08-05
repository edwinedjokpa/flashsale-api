import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Http } from '@status/codes';
import { Inject, Service } from 'typedi';

import { UserModel } from '../user/user.model';
import { LoginUserDto } from './dtos/auth.dto';
import { CreateUserDto } from '../user/dtos/user.dto';
import { HttpException } from '../common/utils/http.exception';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { configService } from '../config';
import AppResponse from '../common/utils/response';

@Service()
export class AuthService {
  constructor(@Inject() private userModel: UserModel) {}

  async register(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const existingUser = await this.userModel.findByEmail(email);
    if (existingUser)
      throw new HttpException(Http.Conflict, 'User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.save({
      ...createUserDto,
      password: hashedPassword,
    });

    if (!user)
      throw new HttpException(
        Http.InternalServerError,
        'Failed to create user account'
      );

    const data = { user };
    return AppResponse.Success('User registered successfully', data);
  }

  // Login user
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    // Check if user exists
    const user = await this.userModel.findByEmail(email);
    if (!user) throw new HttpException(Http.BadRequest, 'Invalid credentials');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      throw new HttpException(Http.BadRequest, 'Invalid credentials');

    const payload: JwtPayload = {
      id: user.id as string,
      email: user.email,
    };

    // Generate JWT token
    const accessToken = jwt.sign(payload, configService.JWT_SECRET, {
      expiresIn: +configService.JWT_EXPIRES_IN,
    });

    const data = { accessToken };
    return AppResponse.Success('User login successful', data);
  }
}

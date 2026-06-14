import { Http } from '@status/codes';
import bcrypt from 'bcryptjs';
import { injectable } from 'inversify';
import jwt from 'jsonwebtoken';

import User from '../user/user.schema';

import { LoginUserDto, RegisterUserDto } from './dto/auth.dto';

import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { HttpException } from '@/common/utils/http.exception';
import AppResponse from '@/common/utils/response';
import { config } from '@/config/index';

@injectable()
export class AuthService {
  constructor() {}

  async register(data: RegisterUserDto) {
    const { email, password } = data;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      throw new HttpException(Http.Conflict, 'Email already taken');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      ...data,
      password: hashedPassword,
    });

    return AppResponse.Success('Account created successfully', { user });
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await User.findOne({ email });
    if (!user) {
      throw new HttpException(Http.BadRequest, 'Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new HttpException(Http.BadRequest, 'Invalid credentials');
    }

    const payload: JwtPayload = {
      id: user.id as string,
      email: user.email,
    };

    const accessToken = jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: +config.JWT_EXPIRES_IN,
    });

    return AppResponse.Success('Account login successful', {
      user: { id: user.id, email: user.email },
      accessToken,
    });
  }
}

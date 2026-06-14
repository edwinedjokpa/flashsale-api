import bcrypt from 'bcryptjs';
import { injectable } from 'inversify';
import jwt from 'jsonwebtoken';

import User from '../user/user.model';

import { LoginUserDto, RegisterUserDto } from './dto/auth.dto';

import { ConflictException, UnauthorizedException } from '@/common/exceptions';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { createSuccessResponse } from '@/common/utils/api-response';
import { config } from '@/config/index';

@injectable()
export class AuthService {
  constructor() {}

  async register(data: RegisterUserDto) {
    const { email, password } = data;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ConflictException('Email already taken');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      ...data,
      password: hashedPassword,
    });

    return createSuccessResponse('Account created successfully', { user });
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      id: user.id as string,
      email: user.email,
    };

    const token = jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: +config.JWT_EXPIRES_IN,
    });

    return createSuccessResponse('Account login successful', {
      user: { id: user.id, email: user.email },
      token,
    });
  }
}

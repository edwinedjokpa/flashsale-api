import { Service } from 'typedi';
import User, { IUser } from './user.schema';
import { CreateUserDto } from './dtos/user.dto';

@Service()
export class UserModel {
  async save(createUserDto: CreateUserDto): Promise<IUser> {
    return User.create(createUserDto);
  }

  async findOne(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }
}

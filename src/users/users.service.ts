import { Password } from './../common/util/Password.class';
import { UserRepository } from './user.repository';
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(private userReps: UserRepository) {}
  async create(createUserDto: CreateUserDto) {
    // create hash
    const password = await Password.createHash(createUserDto.password);
    // save in db
    return this.userReps.create({ ...createUserDto, password });
  }

  async getFriends(user: UserDocument) {
    return this.userReps.findAll({ friends: user.id });
  }

  async suggestingFriends(user: UserDocument) {
    return this.userReps.findAll({});
  }

  async findAll(query: any) {
    const users = await this.userReps.findAll(query);
    return users;
  }

  findOne(id: string) {
    return this.userReps.findById(id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userReps.editOneById(id, updateUserDto);
  }

  remove(id: string) {
    return this.userReps.deleteOneById(id);
  }
}

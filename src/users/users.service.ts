import { Password } from './../common/util/Password.class';
import { join } from 'path';
import { UserRepository } from './user.repository';
import { Injectable, BadRequestException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(private userReps: UserRepository) {}

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

  async profileUpdate(user: UserDocument, updateUserDto: UpdateUserDto) {
    if (updateUserDto.oldPassword) {
      if (!(await Password.validateHash(updateUserDto.oldPassword, user.password))) {
        throw new BadRequestException('invalid data');
      }
      const password = await Password.createHash(updateUserDto.newPassword);

      return this.userReps.editOneById(user.id, { ...updateUserDto, password });
    } else {
      return this.userReps.editOneById(user.id, updateUserDto);
    }
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userReps.editOneById(id, updateUserDto);
  }

  async changeProfileImage(image: Express.Multer.File, user: UserDocument) {
    return this.userReps.editOneById(user.id, {
      image: `${process.env.API_URL}images/${image.filename}`,
    });
  }

  remove(id: string) {
    return this.userReps.deleteOneById(id);
  }

  makeAnAdmin(role: string, id: string) {
    if (role === 'superAdmin') {
      return this.userReps.editOneById(id, { role: 'admin' });
    }
  }
  removeFromAdminList(role: string, id: string) {
    if (role === 'superAdmin') {
      return this.userReps.editOneById(id, { role: 'user' });
    }
  }
}

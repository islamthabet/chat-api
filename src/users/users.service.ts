import { Password } from './../common/util/Password.class';
import { UserRepository } from './user.repository';
import { Injectable, BadRequestException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(private userReps: UserRepository) {}

  async sendFriendRequest(id: string, user: UserDocument) {
    await this.userReps.editOneById(id, { $push: { sendRequest: user.id } });
    return this.userReps.editOneById(user.id, { $push: { pendingResponse: id } });
  }

  async suggestingFriends(user: UserDocument) {
    return this.userReps.findAll({
      _id: { $nin: [user.id, ...user.friends, ...user.pendingResponse, ...user.sendRequest] },
    });
  }

  async findAll(query: any) {
    const users = await this.userReps.findAll(query);
    return users;
  }

  async findOne(id: string) {
    return this.userReps.findById(id);
  }

  async acceptFriendRequest(user: UserDocument, id: string) {
    await this.userReps.editOneById(id, {
      $pull: { pendingResponse: user.id },
      $push: { friends: user.id },
    });
    return this.userReps.editOneById(user.id, {
      $pull: { sendRequest: id },
      $push: { friends: id },
    });
  }

  async rejectFriendRequest(user: UserDocument, id: string) {
    await this.userReps.editOneById(id, {
      $pull: { pendingResponse: user.id },
    });
    return this.userReps.editOneById(user.id, {
      $pull: { sendRequest: id },
    });
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

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userReps.editOneById(id, updateUserDto);
  }

  async changeProfileImage(image: Express.Multer.File, user: UserDocument) {
    return this.userReps.editOneById(user.id, {
      image: `${process.env.API_URL}images/${image.filename}`,
    });
  }

  async remove(id: string) {
    return this.userReps.deleteOneById(id);
  }

  async makeAnAdmin(role: string, id: string) {
    if (role === 'superAdmin') {
      return this.userReps.editOneById(id, { role: 'admin' });
    }
  }

  async removeFromAdminList(role: string, id: string) {
    if (role === 'superAdmin') {
      return this.userReps.editOneById(id, { role: 'user' });
    }
  }
}

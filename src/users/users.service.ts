import { CloudinaryService } from './../cloudinary/cloudinary.service';
import {
  UserRejectFriendRequestEvent,
  UserAcceptFriendRequestEvent,
  UserDeleteEvent,
  UserEvents,
  RoomEvents,
  UserSendFriendRequestEvent,
  RoomCreateEvent,
  RoomDeleteEvent,
} from './../common/events';

import { Password } from './../common/util/Password.class';
import { UserRepository } from './user.repository';
import { Injectable, BadRequestException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './schema/user.schema';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class UsersService {
  constructor(
    private userRepo: UserRepository,
    private eventEmitter: EventEmitter2,
    private cloudinaryService: CloudinaryService,
  ) {}

  async sendFriendRequest(id: string, user: UserDocument) {
    this.eventEmitter.emit(
      UserEvents.USER_SEND_REQUEST,
      new UserSendFriendRequestEvent(user.id, id),
    );
    this.userRepo.editOneById(id, { $push: { sendRequest: user.id } });
    return this.userRepo.editOneById(user.id, { $push: { pendingResponse: id } });
  }

  async acceptFriendRequest(user: UserDocument, id: string) {
    this.eventEmitter.emit(
      UserEvents.USER_ACCEPT_REQUEST,
      new UserAcceptFriendRequestEvent(user.id, id),
    );
    this.userRepo.editOneById(id, {
      $pull: { pendingResponse: user.id },
      $push: { friends: user.id },
    });

    return this.userRepo.editOneById(user.id, {
      $pull: { sendRequest: id },
      $push: { friends: id },
    });
  }

  async rejectFriendRequest(user: UserDocument, id: string) {
    this.eventEmitter.emit(
      UserEvents.USER_REJECT_REQUEST,
      new UserRejectFriendRequestEvent(user.id, id),
    );
    this.userRepo.editOneById(id, {
      $pull: { pendingResponse: user.id },
    });

    return this.userRepo.editOneById(user.id, {
      $pull: { sendRequest: id },
    });
  }

  async suggestingFriends(user: UserDocument) {
    return this.userRepo.findAll({
      $nin: {
        _id: { $nin: [user.id, ...user.friends, ...user.pendingResponse, ...user.sendRequest] },
      },
    });
  }

  async findAll(query: any) {
    return this.userRepo.findAll(query);
  }

  async searchFriends(query: any, user: UserDocument) {
    return this.userRepo.findAll({ ...query, $in: { _id: { $in: [...user.friends] } } });
  }

  async findOne(id: string) {
    return this.userRepo.findById(id);
  }

  async unfriend(user: UserDocument, id: string) {
    this.userRepo.editOneById(id, {
      $pull: { friends: user.id },
    });
    return this.userRepo.editOneById(user.id, {
      $pull: { friends: id },
    });
  }

  async blockUser(user: UserDocument, id: string) {
    this.userRepo.editOneById(id, {
      $pull: { friends: user.id },
      $push: { blockedUsers: user.id },
    });
    return this.userRepo.editOneById(user.id, {
      $pull: { friends: id },
      $push: { blockedUsers: id },
    });
  }

  async profileUpdate(user: UserDocument, updateUserDto: UpdateUserDto) {
    if (updateUserDto.oldPassword) {
      if (!(await Password.validateHash(updateUserDto.oldPassword, user.password))) {
        throw new BadRequestException('invalid data');
      }
      const password = await Password.createHash(updateUserDto.newPassword);

      return this.userRepo.editOneById(user.id, { ...updateUserDto, password });
    } else {
      return this.userRepo.editOneById(user.id, updateUserDto);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepo.editOneById(id, updateUserDto);
  }

  async changeProfileImage(image: Express.Multer.File, user: UserDocument) {
    const upload = await this.cloudinaryService.uploadImage(image);
    return this.userRepo.editOneById(user.id, {
      image: upload.url,
    });
  }

  async remove(id: string) {
    this.eventEmitter.emit(UserEvents.USER_DELETE, new UserDeleteEvent(id));
    this.userRepo.editMany({ $in: { friends: id } }, { $pull: { friends: id } });
    this.userRepo.editMany({ $in: { sendRequest: id } }, { $pull: { sendRequest: id } });
    return this.userRepo.deleteOneById(id);
  }

  async makeAnAdmin(role: string, id: string) {
    if (role === 'superAdmin') {
      return this.userRepo.editOneById(id, { role: 'admin' });
    }
  }

  async removeFromAdminList(role: string, id: string) {
    if (role === 'superAdmin') {
      return this.userRepo.editOneById(id, { role: 'user' });
    }
  }

  @OnEvent(RoomEvents.ROOM_CREATED)
  handelRoomCreated(payload: RoomCreateEvent) {
    this.userRepo.editOneById(payload.member, { $push: { rooms: payload.room } });
    payload.waitingApprove.forEach((user) => {
      this.userRepo.editOneById(user, { $push: { askToJoinRoom: payload.room } });
    });
  }

  @OnEvent(RoomEvents.ROOM_DELETE)
  handleRoomDelete(payload: RoomDeleteEvent) {
    const { id } = payload;
    this.userRepo.editMany({ $in: { rooms: id } }, { $pull: { rooms: id } });
  }
}

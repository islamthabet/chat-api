import {
  UserAcceptFriendRequestEvent,
  UserSendFriendRequestEvent,
  UserRejectFriendRequestEvent,
  UserDeleteEvent,
} from './../common/events/user.events';
import { UserEvents } from './../common/events';
import { UserDocument } from './../users/schema/user.schema';
import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationRepository } from './notification.repository';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationRepo: NotificationRepository) {}
  create(createNotificationDto: CreateNotificationDto) {
    return this.notificationRepo.create(createNotificationDto);
  }

  findAll(user: UserDocument) {
    return this.notificationRepo.findAll({ $in: { to: { $in: [user.id] } } });
  }

  findOne(id: string) {
    return this.notificationRepo.findById(id);
  }

  update(id: string, updateNotificationDto: UpdateNotificationDto) {
    return this.notificationRepo.editOneById(id, updateNotificationDto);
  }

  remove(id: string) {
    return this.notificationRepo.deleteOneById(id);
  }

  @OnEvent(UserEvents.USER_SEND_REQUEST)
  handelFriendRequestEvent(payload: UserSendFriendRequestEvent) {
    const { from, to } = payload;
    this.notificationRepo.create({
      notification: `send friend request to you`,
      from,
      to,
    });
  }
  @OnEvent(UserEvents.USER_ACCEPT_REQUEST)
  handelAcceptFriendRequestEvent(payload: UserAcceptFriendRequestEvent) {
    const { from, to } = payload;
    this.notificationRepo.create({
      notification: `accept you friend request`,
      from,
      to,
    });
  }

  @OnEvent(UserEvents.USER_REJECT_REQUEST)
  handelRejectFriendRequestEvent(payload: UserRejectFriendRequestEvent) {
    const { from, to } = payload;
    this.notificationRepo.create({
      notification: `reject your friend request`,
      from,
      to,
    });
  }

  @OnEvent(UserEvents.USER_DELETE)
  handelUserDelete(payload: UserDeleteEvent) {
    const { id } = payload;
    this.notificationRepo.deleteMany({ $or: [{ from: id }, { to: id }] });
  }
}

import { RoomEvents, RoomCreateEvent, RoomDeleteEvent } from './../common/events/room.events';
import { UserEvents } from './../common/events';
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';
import { UserRepository } from './../users/user.repository';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserDocument } from 'src/users/schema/user.schema';
import { CreateRoomDto, UpdateRoomDto } from './dto';
import { RoomRepository } from './room.repository';

@Injectable()
export class RoomsService {
  constructor(
    private readonly roomRepo: RoomRepository,
    private readonly userRepo: UserRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async create(createRoomDto: CreateRoomDto, user: UserDocument) {
    const room = await this.roomRepo.create({
      ...createRoomDto,
      createdBy: user.id,
      members: [user.id],
      admins: [user.id],
    });
    this.eventEmitter.emit(
      RoomEvents.ROOM_CREATED,
      new RoomCreateEvent(user.id, createRoomDto.userPendingRequests, room.id),
    );
    await this.userRepo.editOneById(user.id, { $push: { rooms: room.id } });
    createRoomDto.userPendingRequests.forEach((user) => {
      this.userRepo.editOneById(user, { $push: { askToJoinRoom: room.id } });
    });
    return room;
  }

  async acceptJoinRoom(roomId: string, user: UserDocument) {
    await this.userRepo.editOneById(user.id, {
      $pull: { askToJoinRoom: roomId },
      $push: { rooms: roomId },
    });
    return this.roomRepo.editOneById(roomId, {
      $pull: { userPendingRequests: user.id },
      $push: { members: user.id },
    });
  }

  async rejectRequest(roomId: string, user: UserDocument) {
    await this.userRepo.editOneById(user.id, { $pull: { askToJoinRoom: roomId } });
    return this.roomRepo.editOneById(roomId, { $pull: { userPendingRequests: user.id } });
  }

  async addUsersToRoom(usersIds: Array<string>, roomId: string) {
    usersIds.forEach((user) => {
      this.userRepo.editOneById(user, { $push: { askToJoinRoom: roomId } });
    });
    return this.roomRepo.editOneById(roomId, { $push: { userPendingRequests: [...usersIds] } });
  }

  async makeAnAdmin(user: UserDocument, usersIds: Array<string>, roomId: string) {
    const room: any = await this.roomRepo.findById(roomId);
    if (room.createdBy.id !== user.id)
      throw new ForbiddenException('only the creator can add an admin');

    return usersIds.forEach((user) => {
      this.roomRepo.editOneById(roomId, { $push: { admins: user } });
    });
  }

  async removeAnAdmin(user: UserDocument, userId: string, roomId: string) {
    const room = await this.roomRepo.findById(roomId);
    const createBy: any = room.createdBy;
    if (createBy !== user.id) throw new ForbiddenException('only the creator can add an admin');
    if (createBy === userId)
      throw new ForbiddenException("you can't remove the creator from the admin list");
    return this.roomRepo.editOneById(roomId, { $pull: { admins: userId } });
  }

  async removeUserFromRoom(user: UserDocument, userId: string, roomId: string) {
    const room = await this.roomRepo.findById(roomId);
    if (!room.admins.includes(user.id)) throw new ForbiddenException('only admin can remove user');
    if (room.admins.includes(userId as any))
      throw new ForbiddenException("you can't remove an admin make him not admin first");
    this.userRepo.editOneById(userId, { $pull: { rooms: roomId } });
    return this.roomRepo.editOneById(roomId, { $pull: { members: userId } });
  }

  async leaveRoom(user: UserDocument, roomId: string) {
    const room = await this.roomRepo.findById(roomId);
    if (room.admins.includes(user.id))
      this.roomRepo.editOneById(roomId, { $pull: { admins: user.id } });
    this.userRepo.editOneById(user.id, { $pull: { rooms: roomId } });
    return this.roomRepo.editOneById(roomId, { $pull: { members: user.id } });
  }

  async findAll(query: any) {
    return this.roomRepo.findAll(query);
  }

  async findOne(id: string) {
    return this.roomRepo.findById(id);
  }

  async update(user: UserDocument, id: string, updateRoomDto: UpdateRoomDto) {
    const room = await this.roomRepo.findById(id);
    if (room.createdBy !== user.id) throw new ForbiddenException('only admin can edit the page');

    return this.roomRepo.editOneById(id, updateRoomDto);
  }

  async remove(user: UserDocument, id: string) {
    const room: any = await this.roomRepo.findById(id);
    if (room.createdBy.id !== user.id)
      throw new ForbiddenException('only admin can remove the page');
    this.eventEmitter.emit(RoomEvents.ROOM_DELETE, new RoomDeleteEvent(id));
    return this.roomRepo.deleteOneById(id);
  }

  @OnEvent(UserEvents.USER_DELETE)
  async handelUserDelete(payload: { id: string }) {
    const { id } = payload;
    this.roomRepo.editMany({ $in: { members: id } }, { $pull: { members: id } });
    this.roomRepo.editMany(
      { $in: { userPendingRequests: id } },
      { $pull: { userPendingRequests: id } },
    );
    this.roomRepo.editMany({ $in: { admins: id } }, { $pull: { admins: id } });
    const rooms = await this.roomRepo.deleteMany({ createdBy: id });
  }
}

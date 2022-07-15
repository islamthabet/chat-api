import { Injectable } from '@nestjs/common';
import { UserDocument } from 'src/users/schema/user.schema';
import { CreateRoomDto, UpdateRoomDto } from './dto';
import { RoomRepository } from './room.repository';

@Injectable()
export class RoomsService {
  constructor(private readonly roomRepo: RoomRepository) {}
  create(createRoomDto: CreateRoomDto, user: UserDocument) {
    const members = [...createRoomDto.members, user.id];
    return this.roomRepo.create({ ...createRoomDto, createdBy: user.id, members });
  }

  findAll(query: any) {
    return this.roomRepo.findAll(query);
  }

  findOne(id: string) {
    return this.roomRepo.findById(id);
  }

  update(id: string, updateRoomDto: UpdateRoomDto) {
    return this.roomRepo.editOneById(id, updateRoomDto);
  }

  remove(id: string) {
    return this.roomRepo.deleteOneById(id);
  }
}

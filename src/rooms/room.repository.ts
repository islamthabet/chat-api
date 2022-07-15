import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '../common/db/entity.repository';
import { Room, RoomDocument } from './schema/room.schema';

@Injectable()
export class RoomRepository extends EntityRepository<RoomDocument> {
  constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>) {
    super(roomModel);
  }
  async findByIdWithPopulate(id: string, populateField: Array<{ path: string; property: string }>) {
    const entity = this.roomModel.findById(id);
    populateField.forEach((field) => {
      entity.populate(field.path, field.property);
    });

    return entity;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '../common/db/entity.repository';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UserRepository extends EntityRepository<UserDocument> {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super(userModel);
  }
  async findByIdWithPopulate(id: string, populateField: Array<{ path: string; property: string }>) {
    const entity = this.userModel.findById(id);
    populateField.forEach((field) => {
      entity.populate(field.path, field.property);
    });

    return entity;
  }

  async getSuggesting(user: UserDocument) {
    return this.userModel
      .find({
        _id: { $nin: [user.id, ...user.friends, ...user.pendingResponse, ...user.sendRequest] },
        country: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: user.country.coordinates,
            },
          },
        },
      })
      .sort(`+DOB | ${user.gender === 'male' ? '+gender' : '-gender'}`);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '../common/db/entity.repository';
import { Call, CallDocument } from './schema/call.schema';

@Injectable()
export class CallRepository extends EntityRepository<CallDocument> {
  constructor(@InjectModel(Call.name) private callModel: Model<CallDocument>) {
    super(callModel);
  }
}

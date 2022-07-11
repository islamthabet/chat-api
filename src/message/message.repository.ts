import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '../common/db/entity.repository';
import { Message, MessageDocument } from './schema/message.schema';

@Injectable()
export class MessageRepository extends EntityRepository<MessageDocument> {
  constructor(@InjectModel(Message.name) private messageModel: Model<MessageDocument>) {
    super(messageModel);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '../common/db/entity.repository';
import { Notification, NotificationDocument } from './schema/notification.schema';

@Injectable()
export class NotificationRepository extends EntityRepository<NotificationDocument> {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {
    super(notificationModel);
  }
}

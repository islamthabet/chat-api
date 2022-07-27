import { MongooseModule } from '@nestjs/mongoose';
import { Global, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notification, NotificationSchema } from './schema/notification.schema';
import { NotificationRepository } from './notification.repository';

@Global()
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Notification.name,
        useFactory() {
          const schema = NotificationSchema;
          schema.pre(/find/, function (next) {
            this.populate('from', 'name | image');
            next();
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository],
  exports: [NotificationRepository],
})
export class NotificationModule {}

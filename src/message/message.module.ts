import { MessageRepository } from './message.repository';
import { Message, MessageSchema } from './schema/message.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Message.name,
        useFactory() {
          const schema = MessageSchema;
          schema.pre(/find/, function (next) {
            this.populate('from', 'id | name | email');
            this.populate('to', 'id | name | email');
            next();
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [MessageController],
  providers: [MessageService, MessageRepository],
  exports: [MessageRepository],
})
export class MessageModule {}

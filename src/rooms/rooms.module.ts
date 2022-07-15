import { Room, RoomSchema } from './schema/room.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { RoomRepository } from './room.repository';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Room.name,
        useFactory() {
          const schema = RoomSchema;
          schema.pre(/find/, function (next) {
            this.populate('members', 'name | email | image | age');
            this.populate('admins', 'name | email | image | age');
            this.populate('createdBy', 'name | email | image | age');
            next();
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [RoomsController],
  providers: [RoomsService, RoomRepository],
})
export class RoomsModule {}

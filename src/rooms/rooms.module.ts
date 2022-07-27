import { UsersModule } from './../users/users.module';
import { Room, RoomSchema } from './schema/room.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { RoomRepository } from './room.repository';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeatureAsync([
      {
        name: Room.name,
        useFactory() {
          const schema = RoomSchema;
          schema.pre(/find/, function (next) {
            this.populate('members', 'name | email | image');
            this.populate('admins', 'name | email | image');
            this.populate('createdBy', 'name | email | image');
            next();
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [RoomsController],
  providers: [RoomsService, RoomRepository],
  exports: [RoomRepository],
})
export class RoomsModule {}

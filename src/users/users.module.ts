import { CloudinaryModule } from './../cloudinary/cloudinary.module';
import { User, UserSchema } from './schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './user.repository';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import * as moment from 'moment';

@Module({
  imports: [
    CloudinaryModule,
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.index({ country: '2dsphere' });
          schema.virtual('age').get(function () {
            const user: any = this;
            return moment().diff(moment(user.DOB), 'year').toString();
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UserRepository],
})
export class UsersModule {}

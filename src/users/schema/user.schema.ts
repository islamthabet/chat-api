import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class User {
  //email
  @Prop({ unique: true, required: true })
  email: string;

  //name
  @Prop({ unique: true, required: true })
  name: string;

  // password
  @Prop({ required: true })
  password: string;

  //DOB
  @Prop({ required: true })
  DOB: string;

  // gender
  @Prop({ enum: ['male', 'female'], default: 'male' })
  gender: 'male' | 'female';

  // phone
  @Prop({ required: true })
  phone: string;

  // country
  @Prop({ required: true })
  country: string;

  @Prop({ default: `http://localhost:5000/images/profile.jpg` })
  image: string;

  // role
  @Prop({ required: true, enum: ['admin', 'user'], default: 'user' })
  role: 'admin' | 'user';

  @Prop({ type: [mongoose.SchemaTypes.ObjectId], ref: 'User', default: [] })
  sendRequest: [User];

  @Prop({ type: [mongoose.SchemaTypes.ObjectId], ref: 'User', default: [] })
  pendingResponse: [User];

  @Prop({ type: [mongoose.SchemaTypes.ObjectId], ref: 'User', default: [] })
  friends: [User];

  @Prop({ type: [mongoose.SchemaTypes.ObjectId], ref: 'User', default: [] })
  blockedUsers: [User];
}

export const UserSchema = SchemaFactory.createForClass(User);

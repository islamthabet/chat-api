import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
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

  // city
  // @Prop({ required: true })
  // city: string;

  @Prop()
  image: string;

  // role
  @Prop({ required: true, enum: ['admin', 'user'] })
  role: 'admin' | 'user';

  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'User' })
  friends: [User];
}

export const UserSchema = SchemaFactory.createForClass(User);

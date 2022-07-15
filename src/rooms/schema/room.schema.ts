import { User } from './../../users/schema/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type RoomDocument = Room & Document;

@Schema({
  timestamps: true,
})
export class Room {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ default: 'http://localhost:5000/images/space.webp' })
  image: string;

  @Prop({ required: true, type: mongoose.SchemaTypes.ObjectId, ref: 'User' })
  createdBy: User;

  @Prop({ type: [mongoose.SchemaTypes.ObjectId], ref: 'User' })
  members: [User];

  @Prop({ type: [mongoose.SchemaTypes.ObjectId], ref: 'User' })
  admins: [User];

  @Prop({ type: [mongoose.SchemaTypes.ObjectId], ref: 'User' })
  userPendingRequests: [User];
}

export const RoomSchema = SchemaFactory.createForClass(Room);

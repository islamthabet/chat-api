import { Room } from 'src/rooms/schema/room.schema';
import { User } from './../../users/schema/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({
  timestamps: true,
})
export class Message {
  @Prop({ required: true })
  message: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  from: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  toUser: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Room' })
  toRoom: Room;

  @Prop({ default: false })
  readied: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

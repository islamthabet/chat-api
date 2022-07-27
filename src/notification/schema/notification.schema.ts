import { User } from './../../users/schema/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({
  timestamps: true,
})
export class Notification {
  @Prop({ required: true })
  notification: string;

  @Prop({ required: true, type: mongoose.SchemaTypes.ObjectId, ref: 'User' })
  from: User;

  @Prop({ required: true, type: [mongoose.SchemaTypes.ObjectId], ref: 'User' })
  to: [User];

  @Prop({ default: false })
  readied: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

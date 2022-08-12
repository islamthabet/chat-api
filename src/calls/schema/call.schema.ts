import { User } from './../../users/schema/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type CallDocument = Document & Call;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Call {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  from: User;
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  to: User;
  @Prop()
  endAt: Date;
  @Prop({ enum: ['audio', 'video'] })
  type: 'audio' | 'video';
  @Prop({ enum: ['answer', 'no-answer', 'reject'] })
  status: 'answer' | 'no-answer' | 'reject';
}

export const CallSchema = SchemaFactory.createForClass(Call);

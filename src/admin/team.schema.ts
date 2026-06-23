import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Team extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ default: 0 })
  score: number;
}

export const TeamSchema = SchemaFactory.createForClass(Team);

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class Kids {
    @Prop({ required: true })
    name: string;
    @Prop({required: false, default: 0})
    score: number;
}

export const KidsSchema = SchemaFactory.createForClass(Kids);
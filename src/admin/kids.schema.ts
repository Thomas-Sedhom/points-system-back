import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class Kids {
    @Prop({ type: Types.ObjectId })
    _id: Types.ObjectId;
    @Prop({ required: true })
    name: string;
    score: number = 0;
}

export const KidsSchema = SchemaFactory.createForClass(Kids);
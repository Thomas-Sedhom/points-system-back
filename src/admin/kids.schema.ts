import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ _id: false })
export class PointsHistory {
    @Prop({ required: true, type: Number })
    points: number;

    @Prop({ required: true, type: String })
    note: string;

    @Prop({ required: true, default: Date.now, type: Date })
    date: Date;
}

@Schema()
export class Kids {
    @Prop({ required: true, type: String })
    name: string;

    @Prop({ required: false, default: 0, type: Number })
    score: number;

    @Prop({ type: Types.ObjectId, ref: 'Team', default: null })
    teamId: Types.ObjectId;

    @Prop({ type: [PointsHistory], default: [] })
    history: PointsHistory[];
}

export const KidsSchema = SchemaFactory.createForClass(Kids);
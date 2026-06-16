import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false })
export class PointsHistory {
    @Prop({ required: true })
    points: number;

    @Prop({ required: true })
    note: string;

    @Prop({ required: true, default: Date.now })
    date: Date;
}

@Schema()
export class Kids {
    @Prop({ required: true })
    name: string;

    @Prop({ required: false, default: 0 })
    score: number;

    @Prop({ type: [PointsHistory], default: [] })
    history: PointsHistory[];
}

export const KidsSchema = SchemaFactory.createForClass(Kids);
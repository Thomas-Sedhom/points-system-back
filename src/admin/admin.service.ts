import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Kids } from "./kids.schema";

@Injectable()
export class AdminService {
    constructor(
        @InjectModel('Kids') private readonly kidsModel: Model<Kids>
    ) { }
    async getAllChildren() {
        const children = await this.kidsModel.find().sort({ score: -1 }).exec();
        return children.map(child => ({
            name: child.name,
            score: child.score
        }));
    }

    async editChildScore(id: string, score: number) {
        const child = await this.kidsModel.findById(id).exec();
        if (!child) {
            throw new Error('Child not found');
        }
        child.score += score;
        await child.save();
        return "Child score updated successfully";
    }
}
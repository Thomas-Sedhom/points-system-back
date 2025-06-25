import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model, mongo } from "mongoose";
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
            score: child.score,
            _id: child._id
        }));
    }

    async addKid(kidName: string){
        return await this.kidsModel.create({
            name: kidName
        })
    }

    async editChildScore(id: string, score: number) {
        const userId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id) 
        const child = await this.kidsModel.findById(userId).exec();
        if (!child) {
            throw new Error('Child not found');
        }
        child.score += score;
        await child.save();
        return "Child score updated successfully";
    }
}
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
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
            history: child.history,
            _id: child._id
        }));
    }

    async addKid(kidName: string) {
        if (!kidName || kidName.trim() === '') {
            throw new BadRequestException('Kid name is required');
        }

        const existingKid = await this.kidsModel.findOne({
            name: { $regex: new RegExp(`^${kidName.trim()}$`, 'i') }
        }).exec();

        if (existingKid) {
            throw new BadRequestException('A kid with this name already exists');
        }

        return await this.kidsModel.create({
            name: kidName.trim()
        });
    }

    async editChildScore(id: string, score: number, note: string) {
        if (!note || note.trim() === '') {
            throw new BadRequestException('Note is required when updating points');
        }

        const userId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id);
        const child = await this.kidsModel.findById(userId).exec();
        if (!child) {
            throw new NotFoundException('Child not found');
        }

        child.score += score;
        child.history.push({
            points: score,
            note: note.trim(),
            date: new Date()
        });

        await child.save();
        return {
            message: "Child score updated successfully",
            score: child.score,
            history: child.history
        };
    }
}
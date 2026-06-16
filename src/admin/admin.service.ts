import { BadRequestException, Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { Kids } from "./kids.schema";

@Injectable()
export class AdminService {
    private readonly logger = new Logger(AdminService.name);
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
        this.logger.log(`addKid called with name='${kidName}'`);

        if (!kidName || kidName.trim() === '') {
            this.logger.warn('addKid failed: name is required');
            throw new BadRequestException('Kid name is required');
        }

        // Escape user-provided name before using in RegExp to avoid
        // crashing on names containing regex special characters.
        const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\\]\\]/g, "\\\\$&");
        const safeName = kidName.trim();

        try {
            const existingKid = await this.kidsModel.findOne({
                name: { $regex: new RegExp(`^${escapeRegex(safeName)}$`, 'i') }
            }).exec();

            if (existingKid) {
                this.logger.warn(`addKid failed: duplicate name='${safeName}'`);
                throw new BadRequestException('A kid with this name already exists');
            }

            const created = await this.kidsModel.create({
                name: safeName
            });
            this.logger.log(`addKid succeeded: id='${created._id}' name='${safeName}'`);
            return created;
        } catch (err) {
            this.logger.error(`addKid error for name='${kidName}': ${err?.message ?? err}`, err?.stack ?? '');
            throw err;
        }
    }

    async editChildScore(id: string, score: number, note: string) {
        this.logger.log(`editChildScore called id='${id}' score=${score}`);
        if (!note || note.trim() === '') {
            this.logger.warn('editChildScore failed: note is required');
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
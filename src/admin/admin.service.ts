import { BadRequestException, Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { Kids } from "./kids.schema";
import { Team } from "./team.schema";

@Injectable()
export class AdminService {
    private readonly logger = new Logger(AdminService.name);
    constructor(
        @InjectModel(Kids.name) private readonly kidsModel: Model<Kids>,
        @InjectModel(Team.name) private readonly teamModel: Model<Team>
    ) { }

    async getAllChildren() {
        const children = await this.kidsModel.find().populate('teamId').sort({ score: -1 }).exec();
        return children.map(child => ({
            name: child.name,
            score: child.score,
            history: child.history,
            team: child.teamId,
            _id: child._id
        }));
    }

    async addKid(kidName: string, teamId?: string) {
        this.logger.log(`addKid called with name='${kidName}', teamId='${teamId}'`);

        if (!kidName || kidName.trim() === '') {
            throw new BadRequestException('Kid name is required');
        }

        const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const safeName = kidName.trim();

        try {
            const existingKid = await this.kidsModel.findOne({
                name: { $regex: new RegExp(`^${escapeRegex(safeName)}$`, 'i') }
            }).exec();

            if (existingKid) {
                throw new BadRequestException('A kid with this name already exists');
            }

            const created = await this.kidsModel.create({
                name: safeName,
                teamId: teamId ? new mongoose.Types.ObjectId(teamId) : null
            });
            return created;
        } catch (err) {
            this.logger.error(`addKid error: ${err.message}`);
            throw err;
        }
    }

    async editChildScore(id: string, score: number, note: string) {
        if (!note || note.trim() === '') {
            throw new BadRequestException('Note is required when updating points');
        }

        const child = await this.kidsModel.findById(id).exec();
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

        // If child belongs to a team, update team score and sync other members
        if (child.teamId) {
            const team = await this.teamModel.findById(child.teamId).exec();
            if (team) {
                team.score += score;
                await team.save();

                // Update all other team members (excluding the current child)
                await this.kidsModel.updateMany(
                    { teamId: child.teamId, _id: { $ne: child._id } },
                    { 
                        $inc: { score: score },
                        $push: { 
                            history: { 
                                points: score, 
                                note: `Team update (${team.name}): ${note.trim()}`, 
                                date: new Date() 
                            } 
                        }
                    }
                ).exec();
            }
        }

        return {
            message: "Score updated successfully",
            score: child.score
        };
    }

    async createTeam(name: string) {
        if (!name || name.trim() === '') {
            throw new BadRequestException('Team name is required');
        }
        const safeName = name.trim();
        const existing = await this.teamModel.findOne({ name: safeName }).exec();
        if (existing) {
            throw new BadRequestException('Team already exists');
        }
        return this.teamModel.create({ name: safeName });
    }

    async getAllTeams() {
        return this.teamModel.find().exec();
    }
}

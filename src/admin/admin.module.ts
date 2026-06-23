import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Kids, KidsSchema } from './kids.schema';
import { Team, TeamSchema } from './team.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Kids.name, schema: KidsSchema },
            { name: Team.name, schema: TeamSchema }
        ])
    ],
    providers: [AdminService],
    controllers: [AdminController]
})
export class AdminModule { }

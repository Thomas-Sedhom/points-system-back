import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Kids, KidsSchema } from './kids.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Kids.name,
                schema: KidsSchema
            }
        ])
    ],
    providers: [AdminService],
    controllers: [AdminController]
})
export class AdminModule { }

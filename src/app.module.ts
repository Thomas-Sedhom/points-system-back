import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { MongooseModule } from '@nestjs/mongoose';
const uri = "mongodb+srv://polesawny5:eEb1u9xWpLQwtQxP@cluster0.8kcz5re.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

@Module({
  imports: [
    MongooseModule.forRoot(uri),
    AdminModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

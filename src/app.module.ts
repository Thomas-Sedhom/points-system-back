import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { MongooseModule } from '@nestjs/mongoose';
const uri = process.env.MONGO_URI || "mongodb+srv://thomassedhom5_db_user:N0cUlcswImRltvJX@cluster0.b1sskgk.mongodb.net/?appName=Cluster0";
@Module({
  imports: [
    MongooseModule.forRoot(uri),
    AdminModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

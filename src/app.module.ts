import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { MongooseModule } from '@nestjs/mongoose';
const uri = "mongodb+srv://thomassedhom5:A6KJzTIDC6WPxk6G@cluster0.u3pkafz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

@Module({
  imports: [
    MongooseModule.forRoot(uri),
    AdminModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "./users/users.module";
import { NanoMachinesModule } from "./nano-machines/nano-machines.module";

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://localhost:27017/nanodrop", {
      autoIndex: true,
      autoCreate: true,
    }),
    UsersModule,
    NanoMachinesModule,
  ],
})
export class AppModule {}

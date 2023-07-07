import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import {
  INanoMachine,
  NanoMachineSchema,
} from "src/nano-machines/schemas/nano-machine.schema";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ index: true, unique: true, required: true, _id: false })
  publicKey: string;

  @Prop({ type: [NanoMachineSchema], required: true, default: [] })
  nanoMachines: INanoMachine[];
}

export const UserSchema = SchemaFactory.createForClass(User);

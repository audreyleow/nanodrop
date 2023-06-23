import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type NanoMachineDocument = HydratedDocument<NanoMachine>;

@Schema()
export class NanoMachine {
  @Prop({ index: true, unique: true, required: true, type: String })
  nanoMachineId: string;

  @Prop()
  backgroundImageUrl: string;

  @Prop({ required: true })
  jwtSecret: string;
}

export const NanoMachineSchema = SchemaFactory.createForClass(NanoMachine);

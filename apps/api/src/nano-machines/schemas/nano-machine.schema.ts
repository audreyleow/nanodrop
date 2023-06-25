import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type NanoMachineDocument = HydratedDocument<NanoMachine>;

export interface INanoMachine {
  nanoMachineId: string;
  backgroundImageUrl?: string;
  jwtSecret: string;
  createdAt: Date;
  updatedAt: Date;
}

@Schema({ timestamps: true })
export class NanoMachine {
  @Prop({ index: true, required: true, type: String })
  nanoMachineId: string;

  @Prop()
  backgroundImageUrl: string;

  @Prop({ required: true })
  jwtSecret: string;
}

export const NanoMachineSchema = SchemaFactory.createForClass(NanoMachine);

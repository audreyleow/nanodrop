import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type AuthRequestDocument = HydratedDocument<AuthRequest>;

export interface IAuthRequest {
  message: string;
  messageHash: string;
  publicKey: string;
  createdAt: Date;
  updatedAt: Date;
}

@Schema({ timestamps: true, expireAfterSeconds: 60 })
export class AuthRequest {
  @Prop({ index: true, unique: true, required: true, type: String })
  message: string;

  @Prop({ index: true, unique: true, required: true, type: String })
  messageHash: string;

  @Prop({ required: true, type: String })
  publicKey: string;
}

export const AuthRequestSchema = SchemaFactory.createForClass(AuthRequest);

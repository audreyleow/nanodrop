import { Prop, Schema, SchemaFactory, raw } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type AuthRequestDocument = HydratedDocument<AuthRequest>;

export interface IAuthRequest {
  message: string;
  publicKey: string;
  createdAt: Date;
  updatedAt: Date;
}

@Schema()
export class AuthRequest {
  @Prop(
    raw({
      default: () => new Date(Date.now() + 45 * 1000),
      expires: 0,
      type: Date,
    })
  )
  expiresAt: Date;

  @Prop({ index: true, unique: true, required: true, type: String })
  message: string;

  @Prop({ required: true, type: String })
  publicKey: string;
}

export const AuthRequestSchema = SchemaFactory.createForClass(AuthRequest);

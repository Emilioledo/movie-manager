import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { v4 as uuidv4 } from "uuid";
import { HydratedDocument } from "mongoose";
import { Role } from "../interfaces/auth.interface";

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: "users" })
export class User {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);

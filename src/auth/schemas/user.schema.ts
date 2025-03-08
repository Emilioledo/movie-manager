import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Rol } from "../interfaces/auth.interface";

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: "users" })
export class User {
  @Prop()
  _id: number;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  rol: Rol;
}

export const UserSchema = SchemaFactory.createForClass(User);

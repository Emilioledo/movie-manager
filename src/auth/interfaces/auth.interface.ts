export type Role = "admin" | "user";

export interface User {
  _id: number;
  username: string;
  password: string;
  role: Role;
}

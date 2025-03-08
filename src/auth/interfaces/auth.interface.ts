export type Rol = "admin" | "user";

export interface User {
  _id: number;
  username: string;
  password: string;
  rol: Rol;
}

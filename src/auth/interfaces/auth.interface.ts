type Rol = 'admin' | 'user';

export interface User {
  id: number;
  username: string;
  password: string;
  rol: Rol;
}

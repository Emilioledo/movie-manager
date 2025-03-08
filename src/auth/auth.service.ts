import { Injectable } from "@nestjs/common";
import { AuthDto } from "./dto/auth.dto";
import { JwtService } from "@nestjs/jwt";
import { User } from "./interfaces/auth.interface";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  users: User[] = [
    { id: 1, username: "john", password: "changeme", rol: "admin" },
  ];

  findOne(username: string): User {
    return this.users.find((user) => user.username === username)!;
  }

  signUp(authDto: AuthDto) {
    const { username, password } = authDto;
    const newUser: User = { id: 2, username, password, rol: "admin" };
    this.users.push(newUser);
    return true;
  }

  async signIn(authDto: AuthDto): Promise<{ access_token: string }> {
    const { username } = authDto;
    const user = this.findOne(username);
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}

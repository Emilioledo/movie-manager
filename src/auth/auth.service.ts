import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthDto } from "./dto/auth.dto";
import { JwtService } from "@nestjs/jwt";
import { User } from "./interfaces/auth.interface";

import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  saltOrRounds: number = 10;

  users: User[] = [
    { id: 1, username: "john", password: "changeme", rol: "admin" },
  ];

  findOne(username: string): User {
    return this.users.find((user) => user.username === username)!;
  }

  async register(authDto: AuthDto) {
    const { username, password } = authDto;
    const hashPass = await bcrypt.hash(password, this.saltOrRounds);
    const newUser: User = { id: 2, username, password: hashPass, rol: "user" };
    this.users.push(newUser);
    return true;
  }

  async login(authDto: AuthDto): Promise<{ access_token: string }> {
    const { username, password } = authDto;
    const user = this.findOne(username);
    const isPasswordMatch = await bcrypt.compare(password, user?.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}

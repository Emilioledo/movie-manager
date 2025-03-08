import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthDto } from "./dto/auth.dto";
import { JwtService } from "@nestjs/jwt";
import { User } from "./schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  saltOrRounds: number = 10;

  async findOne(username: string): Promise<User | null> {
    const query = this.userModel.where({ username });
    return query.findOne();
  }

  async register(authDto: AuthDto) {
    const { username, password } = authDto;
    const user = await this.findOne(username);
    if (user) throw new ConflictException("User already exists");
    const hashPass = await bcrypt.hash(password, this.saltOrRounds);
    await this.userModel.create({ username, password: hashPass, rol: "user" });
  }

  async login(authDto: AuthDto): Promise<{ access_token: string }> {
    const { username, password } = authDto;
    const user = await this.findOne(username);
    if (!user) throw new ConflictException("User does not exist");
    const isPasswordMatch = await bcrypt.compare(password, user?.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user._id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}

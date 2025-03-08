import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthDto, ChangeRoleDto } from "./dto/auth.dto";
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

  async register(authDto: AuthDto): Promise<void> {
    const { username, password } = authDto;

    try {
      const user = await this.findOne(username);
      if (user) {
        throw new ConflictException("User already exists");
      }

      const hashPass = await bcrypt.hash(password, this.saltOrRounds);

      await this.userModel.create({
        username,
        password: hashPass,
        role: "user",
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException(
        "An error occurred while registering the user",
      );
    }
  }

  async login(authDto: AuthDto): Promise<{ access_token: string }> {
    try {
      const { username, password } = authDto;
      const user = await this.findOne(username);
      if (!user) throw new ConflictException("User does not exist");
      const isPasswordMatch = await bcrypt.compare(password, user?.password);
      if (!isPasswordMatch) {
        throw new UnauthorizedException();
      }
      const payload = {
        sub: user._id.toString(),
        username: user.username,
        role: user.role,
      };

      const access_token = await this.jwtService.signAsync(payload);

      return {
        access_token,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException(
        "An error occurred while registering the user",
      );
    }
  }

  async changeRole(changeRoleDto: ChangeRoleDto): Promise<void> {
    try {
      const { username, role } = changeRoleDto;
      const user = await this.findOne(username);
      if (!user) throw new ConflictException("User does not exist");
      await this.userModel.updateOne({ username }, { role });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException(
        "An error occurred while registering the user",
      );
    }
  }
}

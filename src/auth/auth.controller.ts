import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto, ChangeRoleDto } from "./dto/auth.dto";
import { AuthGuard } from "./guards/Auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post("register")
  async register(@Body(ValidationPipe) authDto: AuthDto) {
    return this.authService.register(authDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post("login")
  async login(@Body(ValidationPipe) authDto: AuthDto) {
    return this.authService.login(authDto);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Put("change-role")
  async changeRole(
    @Body(ValidationPipe) changeRoleDto: ChangeRoleDto,
    @Req() request,
  ) {
    const user = request.user;
    if (user.role !== "admin") {
      throw new UnauthorizedException(
        "Only users with the admin role can change the role of other users",
      );
    }
    return this.authService.changeRole(changeRoleDto);
  }
}

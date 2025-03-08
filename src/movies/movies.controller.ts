import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Req,
  UseGuards,
} from "@nestjs/common";
import { MoviesService } from "./movies.service";
import { AuthGuard } from "src/auth/guards/Auth.guard";

@Controller("movies")
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllMovies() {
    return this.moviesService.getAllMovies();
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get("/:id")
  async getMovieById(@Param("id") id: number, @Req() request) {
    const { role } = request.user;
    return this.moviesService.getMovieById(id, role);
  }
}

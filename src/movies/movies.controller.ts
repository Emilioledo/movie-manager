import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { MoviesService } from "./movies.service";
import { AuthGuard } from "src/auth/guards/Auth.guard";
import { MovieDto } from "./dto/movie.dto";

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
  async getMovieById(@Param("id") id: string, @Req() request) {
    const { role } = request.user;
    return this.moviesService.getMovieById(id, role);
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  @Post()
  async createMovie(@Body(ValidationPipe) movieDto: MovieDto, @Req() request) {
    const { role } = request.user;
    return this.moviesService.createMovie(movieDto, role);
  }
}

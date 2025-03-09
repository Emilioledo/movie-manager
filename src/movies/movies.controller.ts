import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { MoviesService } from "./movies.service";
import { AuthGuard } from "auth/guards/Auth.guard";
import { CreateMovieDto, UpdateMovieDto } from "./dto/movie.dto";

@Controller("movies")
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post("sync")
  async syncMovies(@Req() request) {
    const { role } = request.user;
    return this.moviesService.syncMovies(role);
  }

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
  async createMovie(
    @Body(ValidationPipe) createMovieDto: CreateMovieDto,
    @Req() request,
  ) {
    const { role } = request.user;
    return this.moviesService.createMovie(createMovieDto, role);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Patch("/:id")
  async updateMovie(
    @Body(ValidationPipe) movieDto: UpdateMovieDto,
    @Param("id") id: string,
    @Req() request,
  ) {
    const { role } = request.user;
    return this.moviesService.updateMovie(movieDto, id, role);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Delete("/:id")
  async deleteMovie(@Param("id") id: string, @Req() request) {
    const { role } = request.user;
    return this.moviesService.deleteMovie(id, role);
  }
}

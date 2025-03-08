import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { MoviesService } from "./movies.service";

@Controller("movies")
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}
  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllMovies() {
    return this.moviesService.getAllMovies();
  }
}

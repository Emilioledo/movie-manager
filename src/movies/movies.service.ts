import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Movie } from "./schemas/movie.schema";
import { Model } from "mongoose";
import { MovieDto } from "./dto/movie.dto";

@Injectable()
export class MoviesService {
  constructor(@InjectModel(Movie.name) private movieModel: Model<Movie>) {}

  async findOne(title: string): Promise<Movie | null> {
    const query = this.movieModel.where({ title });
    return query.findOne();
  }

  async getAllMovies() {
    const response = await this.movieModel.find();
    return {
      count: response.length,
      movies: response,
    };
  }

  async getMovieById(id: string, role: string) {
    if (role !== "user") {
      throw new UnauthorizedException(
        "Only users with the user role can see the movie details",
      );
    }
    const movie = await this.movieModel.findById(id);
    if (!movie) {
      throw new NotFoundException("Movie not found");
    }
    return movie;
  }

  async createMovie(movieDto: MovieDto, role: string) {
    if (role !== "admin") {
      throw new UnauthorizedException(
        "Only users with the admin role can create a movie",
      );
    }
    const movie = await this.movieModel.findOne({ title: movieDto.title });
    if (movie) {
      throw new NotFoundException("Movie already exists");
    }

    const movieData = {
      ...movieDto,
      created: new Date(),
    };
    return this.movieModel.create(movieData);
  }
}

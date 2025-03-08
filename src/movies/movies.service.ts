import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Movie } from "./schemas/movie.schema";
import { Model } from "mongoose";

@Injectable()
export class MoviesService {
  constructor(@InjectModel(Movie.name) private movieModel: Model<Movie>) {}

  async findOne(movieId: number): Promise<Movie | null> {
    const query = this.movieModel.where({ movieId });
    return query.findOne();
  }

  async getAllMovies() {
    const response = await this.movieModel.find();
    return {
      count: response.length,
      movies: response,
    };
  }

  async getMovieById(id: number, role: string) {
    if (role !== "user") {
      throw new UnauthorizedException(
        "Only users with the user role can see the movie details",
      );
    }
    const movie = await this.findOne(id);
    if (!movie) {
      throw new NotFoundException("Movie not found");
    }
    return movie;
  }
}

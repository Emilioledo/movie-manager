import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Movie } from "./schemas/movie.schema";
import { Model, Types } from "mongoose";
import { CreateMovieDto, UpdateMovieDto } from "./dto/movie.dto";

@Injectable()
export class MoviesService {
  constructor(@InjectModel(Movie.name) private movieModel: Model<Movie>) {}

  async findOne(title: string): Promise<Movie | null> {
    const query = this.movieModel.where({ title });
    return query.findOne();
  }

  async getAllMovies(): Promise<{ count: number; movies: Movie[] }> {
    const response = await this.movieModel.find();
    return {
      count: response.length,
      movies: response,
    };
  }

  isInvalidId(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Invalid movie ID");
    }
  }

  isAdminRole(role: string) {
    if (role !== "admin") {
      throw new UnauthorizedException(
        "Only users with the admin role can create a movie",
      );
    }
  }

  isUserRole(role: string) {
    if (role !== "user") {
      throw new UnauthorizedException(
        "Only users with the user role can see the movie details",
      );
    }
  }

  async getMovieById(id: string, role: string): Promise<Movie | null> {
    this.isUserRole(role);
    const movie = await this.movieModel.findById(id);
    if (!movie) {
      throw new NotFoundException("Movie not found");
    }
    return movie;
  }

  async createMovie(
    createMovieDto: CreateMovieDto,
    role: string,
  ): Promise<Movie | null> {
    this.isAdminRole(role);

    const movie = await this.movieModel.findOne({
      title: createMovieDto.title,
    });
    if (movie) {
      throw new NotFoundException("Movie already exists");
    }

    const movieData = {
      ...createMovieDto,
      created: new Date(),
    };
    return this.movieModel.create(movieData);
  }

  async updateMovie(
    updateMovieDto: UpdateMovieDto,
    id: string,
    role: string,
  ): Promise<Movie | null> {
    this.isAdminRole(role);
    this.isInvalidId(id);

    const movie = await this.movieModel.findById(id);
    if (!movie) {
      throw new NotFoundException("Movie does not exist");
    }

    const updatedMovie = await this.movieModel
      .findByIdAndUpdate(id, { $set: updateMovieDto }, { new: true })
      .exec();

    return updatedMovie;
  }

  async deleteMovie(id: string, role: string): Promise<void> {
    this.isAdminRole(role);

    this.isInvalidId(id);

    const movie = await this.movieModel.findById(id);
    if (!movie) {
      throw new NotFoundException("Movie does not exist");
    }

    await this.movieModel.deleteOne({ _id: id });
  }
}

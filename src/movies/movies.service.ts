import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Movie } from "./schemas/movie.schema";
import { Model } from "mongoose";
import { count } from "console";

@Injectable()
export class MoviesService {
  constructor(@InjectModel(Movie.name) private movieModel: Model<Movie>) {}
  async getAllMovies() {
    const response = await this.movieModel.find();
    console.log("response", response);
    return {
      count: response.length,
      movies: response,
    };
  }
}

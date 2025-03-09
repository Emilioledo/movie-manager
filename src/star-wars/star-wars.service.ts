import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { Movie } from "src/movies/interfaces/movies.interface";

@Injectable()
export class StarWarsService {
  constructor(private readonly httpService: HttpService) {}

  async findAllMovies(): Promise<Movie[]> {
    const response = await firstValueFrom(
      this.httpService.get<Movie[]>(process.env.API_BASE_URL!),
    );
    return response.data;
  }
}

import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { ApiResponse } from "./interfaces/star-wars.interface";

@Injectable()
export class StarWarsService {
  constructor(private readonly httpService: HttpService) {}

  async findAllMovies(): Promise<ApiResponse> {
    const response = await firstValueFrom(
      this.httpService.get<ApiResponse>(process.env.API_BASE_URL!),
    );
    return response.data;
  }
}

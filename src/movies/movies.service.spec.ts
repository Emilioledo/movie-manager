import { Test, TestingModule } from "@nestjs/testing";
import { MoviesController } from "./movies.controller";
import { MoviesService } from "./movies.service";
import { ExecutionContext } from "@nestjs/common";
import { getModelToken } from "@nestjs/mongoose";
import { Movie } from "./schemas/movie.schema";
import { StarWarsService } from "star-wars/star-wars.service";
import { AuthGuard } from "auth/guards/Auth.guard";

describe("MoviesController", () => {
  let controller: MoviesController;
  let moviesService: MoviesService;

  const mockMoviesService = {
    getAllMovies: jest.fn().mockResolvedValue({
      count: 1,
      movies: [{ title: "Star Wars", director: "George Lucas" }],
    }),
    getMovieById: jest
      .fn()
      .mockResolvedValue({ title: "Star Wars", director: "George Lucas" }),
    createMovie: jest
      .fn()
      .mockResolvedValue({ title: "New Movie", director: "New Director" }),
    updateMovie: jest.fn().mockResolvedValue({
      title: "Updated Movie",
      director: "Updated Director",
    }),
    deleteMovie: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        { provide: MoviesService, useValue: mockMoviesService },
        { provide: getModelToken(Movie.name), useValue: {} },
        { provide: StarWarsService, useValue: {} },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: (context: ExecutionContext) => true })
      .compile();

    controller = module.get<MoviesController>(MoviesController);
    moviesService = module.get<MoviesService>(MoviesService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should return all movies", async () => {
    const result = await controller.getAllMovies();
    expect(result).toEqual({
      count: 1,
      movies: [{ title: "Star Wars", director: "George Lucas" }],
    });
  });

  it("should return a movie by ID", async () => {
    const result = await controller.getMovieById("1", {
      user: { role: "user" },
    });
    expect(result).toEqual({ title: "Star Wars", director: "George Lucas" });
  });

  it("should create a movie", async () => {
    const dto = {
      title: "New Movie",
      director: "New Director",
      producer: "New Producer",
      release_date: "2023-01-01",
    };
    const result = await controller.createMovie(dto, {
      user: { role: "admin" },
    });
    expect(result).toEqual({ title: "New Movie", director: "New Director" });
  });

  it("should update a movie", async () => {
    const dto = {
      title: "Updated Movie",
      director: "Updated Director",
      producer: "Updated Producer",
      release_date: "2023-01-01",
    };
    const result = await controller.updateMovie(dto, "1", {
      user: { role: "admin" },
    });
    expect(result).toEqual({
      title: "Updated Movie",
      director: "Updated Director",
    });
  });

  it("should delete a movie", async () => {
    await expect(
      controller.deleteMovie("1", { user: { role: "admin" } }),
    ).resolves.toBeUndefined();
  });
});

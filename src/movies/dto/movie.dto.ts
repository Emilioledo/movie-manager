import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
} from "class-validator";

export class CreateMovieDto {
  @ApiProperty({
    description: "The title of the movie",
    example: "A New Hope",
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "The director of the movie",
    example: "George Lucas",
  })
  @IsString()
  @IsNotEmpty()
  director: string;

  @ApiProperty({
    description: "The producer of the movie",
    example: "Gary Kurtz, Rick McCallum",
  })
  @IsString()
  @IsNotEmpty()
  producer: string;

  @ApiProperty({
    description: "The release date of the movie",
    example: "1977-05-25",
  })
  @IsDateString()
  @IsNotEmpty()
  release_date: string;
}

export class UpdateMovieDto {
  @ApiProperty({
    description: "The title of the movie",
    example: "A New Hope",
  })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({
    description: "The director of the movie",
    example: "George Lucas",
  })
  @IsString()
  @IsOptional()
  director: string;

  @ApiProperty({
    description: "The producer of the movie",
    example: "Gary Kurtz, Rick McCallum",
  })
  @IsString()
  @IsOptional()
  producer: string;

  @ApiProperty({
    description: "The release date of the movie",
    example: "1977-05-25",
  })
  @IsDateString()
  @IsOptional()
  release_date: string;
}

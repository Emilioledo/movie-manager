import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsDateString } from "class-validator";

export class MovieDto {
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

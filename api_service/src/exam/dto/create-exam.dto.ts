import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsNotEmpty,
    MinLength,
    MaxLength,
    IsNumber,
    Min,
    Max,
} from 'class-validator';

export class CreateExamDto {
    @ApiProperty()
    @MinLength(5)
    @MaxLength(100)
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @MinLength(5)
    @MaxLength(1024)
    @IsNotEmpty()
    desc: string;

    @ApiProperty()
    @IsNumber()
    @Min(1)
    @IsNotEmpty()
    @Type(() => Number)
    duration_in_minutes: number;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    @Max(1)
    @IsNotEmpty()
    @Type(() => Number)
    pass_score: number;
}

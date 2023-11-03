import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsNotEmpty,
    MinLength,
    MaxLength,
    IsNumber,
    Min,
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
    @Min(5)
    @IsNotEmpty()
    @Type(() => Number)
    duration_in_minutes: number;
}

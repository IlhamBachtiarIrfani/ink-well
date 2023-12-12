import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsNotEmpty,
    MinLength,
    ArrayMinSize,
    ArrayMaxSize,
    Min,
    Max,
    ArrayUnique,
} from 'class-validator';

export class CreateQuestionDto {
    @ApiProperty()
    @MinLength(10)
    @IsNotEmpty()
    content: string;

    @ApiProperty()
    @MinLength(20)
    @IsNotEmpty()
    answer_key: string;

    @ApiProperty()
    @ArrayMinSize(1)
    @ArrayMaxSize(8)
    @MinLength(3, { each: true })
    @IsNotEmpty()
    @ArrayUnique((value: string) => value.toLowerCase())
    keyword: string[];

    @ApiProperty()
    @Min(1)
    @Max(1000)
    @Type(() => Number)
    point: number;
}

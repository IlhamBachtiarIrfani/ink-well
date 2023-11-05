import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsNotEmpty,
    MinLength,
    ArrayMinSize,
    ArrayMaxSize,
    Min,
    Max,
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
    @MinLength(3, { each: true })
    @IsNotEmpty()
    @ArrayMinSize(1)
    @ArrayMaxSize(8)
    keyword: string[];

    @ApiProperty()
    @Min(1)
    @Max(1000)
    @Type(() => Number)
    point: number;
}

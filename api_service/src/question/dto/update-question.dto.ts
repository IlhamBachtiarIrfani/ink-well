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

export class UpdateQuestionDto {
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
    @ArrayUnique((value: string) => value.toLowerCase())
    keyword: string[];

    @ApiProperty()
    @Min(1)
    @Max(1000)
    @Type(() => Number)
    point: number;
}

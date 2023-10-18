import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    MinLength,
    ArrayMinSize,
    ArrayMaxSize,
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
    keyword: string[];
}

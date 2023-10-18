import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserResponseDto {
    @ApiProperty()
    @MinLength(10)
    @IsNotEmpty()
    content: string;
}

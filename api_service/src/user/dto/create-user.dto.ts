import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    MinLength,
    MaxLength,
    Matches,
} from 'class-validator';

export class CreateUserDto {
    @ApiProperty()
    @IsEmail()
    @MaxLength(100)
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @MinLength(5)
    @MaxLength(100)
    @Matches(/^[a-zA-Z0-9 ]*$/, {
        message: 'Name should only contain alphanumeric characters and spaces',
    })
    name: string;

    @ApiProperty()
    @MinLength(5)
    @MaxLength(100)
    @IsNotEmpty()
    password: string;
}

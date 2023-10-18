import { PartialType } from '@nestjs/swagger';
import { CreateUserResponseDto } from './create-user-response.dto';

export class UpdateUserResponseDto extends PartialType(CreateUserResponseDto) {}

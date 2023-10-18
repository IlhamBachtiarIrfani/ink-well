import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { UserResponseService } from './user-response.service';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { UpdateUserResponseDto } from './dto/update-user-response.dto';

@Controller('user-response')
export class UserResponseController {
    constructor(private readonly userResponseService: UserResponseService) {}

    @Post()
    create(@Body() createUserResponseDto: CreateUserResponseDto) {
        return this.userResponseService.create(createUserResponseDto);
    }

    @Get()
    findAll() {
        return this.userResponseService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userResponseService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateUserResponseDto: UpdateUserResponseDto,
    ) {
        return this.userResponseService.update(+id, updateUserResponseDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userResponseService.remove(+id);
    }
}

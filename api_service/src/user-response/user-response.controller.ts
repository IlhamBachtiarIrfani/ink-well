import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    UseInterceptors,
    ClassSerializerInterceptor,
    Request,
} from '@nestjs/common';
import { UserResponseService } from './user-response.service';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { UpdateUserResponseDto } from './dto/update-user-response.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/user/roles.decorator';
import { AccessRole } from 'src/user/roles.enum';
import { TokenAuthGuard } from 'src/user/token-auth/token-auth.guard';
import { UserTokenData } from 'src/user/entities/user.entity';

@Controller('exam/:examId/question/:questionId/response')
@ApiTags('response')
@Roles(AccessRole.ADMIN, AccessRole.PARTICIPANT)
@UseGuards(TokenAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserResponseController {
    constructor(private readonly userResponseService: UserResponseService) {}

    @Post()
    create(
        @Param('examId') examId: string,
        @Param('questionId') questionId: string,
        @Body() createUserResponseDto: CreateUserResponseDto,
        @Request() req,
    ) {
        const userTokenData: UserTokenData = req.user;
        return this.userResponseService.create(
            userTokenData,
            examId,
            questionId,
            createUserResponseDto,
        );
    }
}

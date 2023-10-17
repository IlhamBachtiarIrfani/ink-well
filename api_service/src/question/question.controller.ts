import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Request,
    ClassSerializerInterceptor,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserTokenData } from 'src/user/entities/user.entity';
import { Roles } from 'src/user/roles.decorator';
import { AccessRole } from 'src/user/roles.enum';
import { TokenAuthGuard } from 'src/user/token-auth/token-auth.guard';

@ApiTags('question')
@Controller('exam/:examId/question/')
@Roles(AccessRole.ADMIN)
@UseGuards(TokenAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {}

    @Post()
    create(
        @Body() createQuestionDto: CreateQuestionDto,
        @Param('examId') examId: string,
        @Request() req,
    ) {
        const userTokenData: UserTokenData = req.user;
        return this.questionService.create(
            userTokenData,
            examId,
            createQuestionDto,
        );
    }

    @Get()
    findAll(@Param('examId') examId: string, @Request() req) {
        const userTokenData: UserTokenData = req.user;
        return this.questionService.findAll(userTokenData, examId);
    }

    @Get(':id')
    findOne(
        @Param('examId') examId: string,
        @Param('id') id: string,
        @Request() req,
    ) {
        const userTokenData: UserTokenData = req.user;
        return this.questionService.findOne(userTokenData, examId, id);
    }

    @Patch(':id')
    update(
        @Param('examId') examId: string,
        @Param('id') id: string,
        @Body() updateQuestionDto: UpdateQuestionDto,
        @Request() req,
    ) {
        const userTokenData: UserTokenData = req.user;
        return this.questionService.update(
            userTokenData,
            examId,
            id,
            updateQuestionDto,
        );
    }

    @Delete(':id')
    remove(
        @Param('examId') examId: string,
        @Param('id') id: string,
        @Request() req,
    ) {
        const userTokenData: UserTokenData = req.user;
        return this.questionService.remove(userTokenData, examId, id);
    }
}

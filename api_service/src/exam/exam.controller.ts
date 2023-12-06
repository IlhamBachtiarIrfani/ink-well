import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    UseInterceptors,
    ClassSerializerInterceptor,
} from '@nestjs/common';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/user/roles.decorator';
import { AccessRole } from 'src/user/roles.enum';
import { TokenAuthGuard } from 'src/user/token-auth/token-auth.guard';
import { UserTokenData } from 'src/user/entities/user.entity';

@Controller('exam')
@ApiTags('exam')
@Roles(AccessRole.ADMIN)
@UseGuards(TokenAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ExamController {
    constructor(private readonly examService: ExamService) {}

    // ! ===== [POST] /exam =====
    // * create new exam
    @Post()
    create(@Body() createExamDto: CreateExamDto, @Request() req) {
        const userTokenData: UserTokenData = req.user;
        return this.examService.create(userTokenData, createExamDto);
    }

    // ! ===== [GET] /exam =====
    // * get all exam that have access with user
    @Get()
    findAll(@Request() req) {
        const userTokenData: UserTokenData = req.user;
        return this.examService.findAll(userTokenData);
    }

    // ! ===== [GET] /exam =====
    // * get all exam that have access with user
    @Get('history')
    @Roles(AccessRole.PARTICIPANT)
    userHistory(@Request() req) {
        const userTokenData: UserTokenData = req.user;
        return this.examService.history(userTokenData);
    }

    // ! ===== [GET] /exam/:id =====
    // * get detail exam by id
    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        const userTokenData: UserTokenData = req.user;
        return this.examService.findOne(userTokenData, id);
    }

    // ! ===== [PATCH] /exam/:id =====
    // * update exam by id
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateExamDto: UpdateExamDto,
        @Request() req,
    ) {
        const userTokenData: UserTokenData = req.user;
        return this.examService.update(userTokenData, id, updateExamDto);
    }

    // ! ===== [DELETE] /exam/:id =====
    // * delete exam by id
    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        const userTokenData: UserTokenData = req.user;
        return this.examService.remove(userTokenData, id);
    }

    // ! ===== [GET] /exam/:id =====
    // * get detail exam by id
    @Post(':id/activate')
    activate(@Param('id') id: string, @Request() req) {
        const userTokenData: UserTokenData = req.user;
        return this.examService.activate(userTokenData, id);
    }

    // ! ===== [GET] /exam/:id =====
    // * get detail exam by id
    @Post(':id/deactivate')
    deactivate(@Param('id') id: string, @Request() req) {
        const userTokenData: UserTokenData = req.user;
        return this.examService.deactivate(userTokenData, id);
    }

    // ! ===== [GET] /exam/:id =====
    // * get detail exam by id
    @Post(':join_code/join')
    @Roles(AccessRole.PARTICIPANT)
    join(@Param('join_code') join_code: string, @Request() req) {
        const userTokenData: UserTokenData = req.user;
        return this.examService.join(userTokenData, join_code);
    }
}

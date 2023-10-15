import {
    Controller,
    Get,
    Post,
    Body,
    UseInterceptors,
    ClassSerializerInterceptor,
    UseGuards,
    Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { BasicAuthGuard } from './basic-auth/basic-auth.guard';
import { MyJwtService } from 'src/config/my-jwt/my-jwt.service';
import { TokenAuthGuard } from './token-auth/token-auth.guard';
import { AccessRole } from './roles.enum';
import { Roles } from './roles.decorator';
import { UserTokenData } from './entities/user.entity';

@ApiTags('user')
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly myJwtService: MyJwtService,
    ) {}

    @Post('register')
    register(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Post('login')
    @UseGuards(BasicAuthGuard)
    login(@Request() req) {
        return this.myJwtService.generateJwt(req.user);
    }

    @Get('profile')
    @Roles(AccessRole.ADMIN, AccessRole.PARTICIPANT)
    @UseGuards(TokenAuthGuard)
    profile(@Request() req) {
        const userTokenData: UserTokenData = req.user;
        return this.userService.getProfile(userTokenData.user_id);
    }

    @Get()
    findAll() {
        return this.userService.findAll();
    }
}

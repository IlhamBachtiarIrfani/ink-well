import {
    BadRequestException,
    ClassSerializerInterceptor,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
    User,
    UserRole,
    UserTokenData,
    getRandomAvatar,
} from './entities/user.entity';
import { Repository } from 'typeorm';
import { EncryptService } from 'src/helper/encrypt/encrypt.service';
import { MyJwtService } from 'src/config/my-jwt/my-jwt.service';

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private encryptService: EncryptService,
        private readonly myJwtService: MyJwtService,
    ) {}

    // ! ===== REGISTER NEW USER =====
    async create(
        createUserDto: CreateUserDto,
        userRole = UserRole.PARTICIPANT,
    ) {
        try {
            // * create new user object
            const newUser = new User();
            newUser.name = createUserDto.name;
            newUser.email = createUserDto.email;
            newUser.role = userRole;
            newUser.photo_url = getRandomAvatar();

            // create new hashes password
            newUser.password = await this.encryptService.hashPassword(
                createUserDto.password,
            );

            // save user object to db
            await this.userRepository.save(newUser);

            return this.login({
                user_id: newUser.id,
                user_name: newUser.name,
                user_email: newUser.email,
                user_role: newUser.role,
                user_photo_url: newUser.photo_url,
            });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                // ! on error email duplicate entry
                throw new BadRequestException(
                    `User with email '${createUserDto.email}' is already exist!`,
                );
            } else {
                // ! on external error
                console.error(error);
                throw new InternalServerErrorException();
            }
        }
    }

    async login(userTokenData: UserTokenData) {
        return this.myJwtService.generateJwt(userTokenData);
    }

    // ! ===== GET USER PROFILE DATA BY USER ID =====
    async getProfile(userId: string) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('USER_NOT_FOUND');
        }

        return user;
    }

    // ! ===== GET ALL USER DATA =====
    findAll() {
        return this.userRepository.find({ order: { created_at: 'DESC' } });
    }
}

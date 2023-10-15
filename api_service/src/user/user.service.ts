import {
    BadRequestException,
    ClassSerializerInterceptor,
    Injectable,
    InternalServerErrorException,
    UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { EncryptService } from 'src/helper/encrypt/encrypt.service';

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private encryptService: EncryptService,
    ) {}

    async create(createUserDto: CreateUserDto) {
        try {
            const newUser = new User();
            newUser.name = createUserDto.name;
            newUser.email = createUserDto.email;
            newUser.password = await this.encryptService.encryptPassword(
                createUserDto.password,
            );

            return await this.userRepository.save(newUser);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                const message = error.message;
                const match = message.match(/Duplicate entry '(.*?)'/i);
                console.log('Duplicate column name:', match);

                throw new BadRequestException(
                    `User with email '${match[1]}' is already Exist`,
                );
            } else {
                console.error(error);
                throw new InternalServerErrorException();
            }
        }
    }

    getProfile(userId: string) {
        return this.userRepository.findOne({ where: { id: userId } });
    }

    findAll() {
        return this.userRepository.find();
    }
}

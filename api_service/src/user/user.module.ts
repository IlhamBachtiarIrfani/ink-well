import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/config/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EncryptModule } from 'src/helper/encrypt/encrypt.module';
import { MyJwtModule } from 'src/config/my-jwt/my-jwt.module';

@Module({
    imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([User]),
        EncryptModule,
        MyJwtModule,
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}

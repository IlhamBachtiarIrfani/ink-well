import { Module } from '@nestjs/common';
import { UserResponseService } from './user-response.service';
import { UserResponseController } from './user-response.controller';

@Module({
    controllers: [UserResponseController],
    providers: [UserResponseService],
})
export class UserResponseModule {}

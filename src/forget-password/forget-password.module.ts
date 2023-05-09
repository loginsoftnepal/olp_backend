import { Module } from '@nestjs/common';
import { ForgetPasswordService } from './forget-password.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForgetPassword } from './forget-password.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ForgetPassword])],
  providers: [ForgetPasswordService],
  exports: [ForgetPasswordService],
})
export class ForgetPasswordModule {}

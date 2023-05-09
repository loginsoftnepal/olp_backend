import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Admin from './admin.entity';
import { Repository } from 'typeorm';
import CreateAdminDto from './dto/CreateAdmin.dto';
import { UpdateAdminDto } from './dto/updateAdmin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  getAdmin() {
    return this.adminRepository.find();
  }

  async createAdmin(adminDetail: CreateAdminDto) {
    const admin = await this.adminRepository.create({
      ...adminDetail,
      createdAt: new Date(Date.now()).toDateString(),
    });
    await this.adminRepository.save(admin);
    return admin;
  }

  async deleteAdmin(id: string) {
    const deleteResponse = await this.adminRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
    }
  }

  async updateAdmin(id: string, adminDetail: UpdateAdminDto) {
    await this.adminRepository.update(id, adminDetail);
    const updatedAdmin = await this.adminRepository.findOne({
      where: { id: id },
    });
    if (updatedAdmin) {
      return updatedAdmin;
    }
    throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
  }

  async setCurrentRefreshToken(refreshToken: string, adminId: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.adminRepository.update(adminId, { currentHashedRefreshToken });
  }
}

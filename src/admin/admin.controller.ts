import { Body, Controller, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { DeleteAdminDto } from './dto/deleteAdmin.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('admin')
@ApiTags('Admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Delete('remove')
  async deleteAdmin(@Body() adminId: DeleteAdminDto) {
    const adminresult = await this.adminService.deleteAdmin(adminId.adminId);
    console.log(adminresult);
    return adminresult;
  }
}

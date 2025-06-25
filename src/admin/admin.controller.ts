import { Controller, Get, Param, Post } from "@nestjs/common";
import { AdminService } from "./admin.service";

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService
  ) { }

  @Get()
  async getAllChildren() {
    return this.adminService.getAllChildren();
  }

  @Post()
  async editChildScore(@Param('id') id: string, @Param('score') score: number) {
    return this.adminService.editChildScore(id, score);
  }
}
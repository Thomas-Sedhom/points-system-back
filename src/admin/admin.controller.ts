import { Body, Controller, Get, Param, Post } from "@nestjs/common";
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

  @Post("addKid")
  async addKid(@Body("name") name: string){
    return this.adminService.addKid(name);
  }

  @Post("/:id")
  async editChildScore(
    @Param('id') id: string,
    @Body('score') score: number,
    @Body('note') note: string
  ) {
    return this.adminService.editChildScore(id, score, note);
  }
}
import { Body, Controller, Get, Param, Post, Logger } from "@nestjs/common";
import { AdminService } from "./admin.service";

@Controller('admin')
export class AdminController {
  private readonly logger = new Logger(AdminController.name);
  constructor(
    private readonly adminService: AdminService
  ) { }

  @Get()
  async getAllChildren() {
    return this.adminService.getAllChildren();
  }

  @Post("addKid")
  async addKid(@Body("name") name: string){
    this.logger.log(`POST /admin/addKid name='${name}'`);
    try {
      return await this.adminService.addKid(name);
    } catch (err) {
      this.logger.error(`Controller addKid error: ${err?.message ?? err}`);
      throw err;
    }
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
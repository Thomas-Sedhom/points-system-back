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
  async addKid(@Body("name") name: string, @Body("teamId") teamId?: string){
    this.logger.log(`POST /admin/addKid name='${name}' teamId='${teamId}'`);
    return this.adminService.addKid(name, teamId);
  }

  @Post("createTeam")
  async createTeam(@Body("name") name: string) {
    this.logger.log(`POST /admin/createTeam name='${name}'`);
    return this.adminService.createTeam(name);
  }

  @Get("teams")
  async getAllTeams() {
    return this.adminService.getAllTeams();
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

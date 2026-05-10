import { Controller, Get, Post, Put, Delete, UseGuards, Request, Param, Body } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get('all')
  @UseGuards(AdminGuard)
  async findAllAdmin() {
    return this.projectsService.findAll();
  }

  @Post()
  @UseGuards(AdminGuard)
  async createProject(@Body() body: { name: string; hostPath: string; description?: string }) {
    return this.projectsService.create(body);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  async updateProject(@Param('id') id: string, @Body() body: { name?: string; hostPath?: string; description?: string }) {
    return this.projectsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async deleteProject(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  @Post(':projectId/assign/:userId')
  @UseGuards(AdminGuard)
  async assignUser(@Param('projectId') projectId: string, @Param('userId') userId: string) {
    return this.projectsService.assignUser(projectId, userId);
  }

  @Get()
  async findAll(@Request() req: any) {
    return this.projectsService.findAllForUser(req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }
}

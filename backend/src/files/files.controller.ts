import { Controller, Get, Post, Body, Query, UseGuards, Param } from '@nestjs/common';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Get(':projectId/list')
  async list(@Param('projectId') projectId: string, @Query('path') path: string) {
    return this.filesService.listFiles(projectId, path || '');
  }

  @Get(':projectId/read')
  async read(@Param('projectId') projectId: string, @Query('path') path: string) {
    const content = await this.filesService.readFile(projectId, path);
    return { content };
  }

  @Post(':projectId/write')
  async write(
    @Param('projectId') projectId: string,
    @Body() body: { path: string; content: string },
  ) {
    return this.filesService.writeFile(projectId, body.path, body.content);
  }

  @Post(':projectId/mkdir')
  async mkdir(
    @Param('projectId') projectId: string,
    @Body() body: { path: string },
  ) {
    return this.filesService.createDirectory(projectId, body.path);
  }

  @Post(':projectId/delete')
  async delete(
    @Param('projectId') projectId: string,
    @Body() body: { path: string },
  ) {
    return this.filesService.deleteItem(projectId, body.path);
  }
}

import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class FilesService {
  constructor(private projectsService: ProjectsService) {}

  private async validatePath(projectId: string, relativePath: string) {
    const project = await this.projectsService.findOne(projectId);
    const absolutePath = path.resolve(project.hostPath, relativePath);

    if (!absolutePath.startsWith(path.resolve(project.hostPath))) {
      throw new ForbiddenException('Access denied: Path traversal detected');
    }

    // Check restricted paths
    const isRestricted = project.restrictedPaths.some((p) => relativePath.includes(p));
    if (isRestricted) {
      throw new ForbiddenException('Access denied: Restricted path');
    }

    return absolutePath;
  }

  async listFiles(projectId: string, relativePath: string = '') {
    const absolutePath = await this.validatePath(projectId, relativePath);
    try {
      const entries = await fs.readdir(absolutePath, { withFileTypes: true });
      return entries.map((entry) => ({
        name: entry.name,
        isDirectory: entry.isDirectory(),
        path: path.join(relativePath, entry.name),
      }));
    } catch (err) {
      throw new NotFoundException('Directory not found');
    }
  }

  async readFile(projectId: string, relativePath: string) {
    const absolutePath = await this.validatePath(projectId, relativePath);
    try {
      return await fs.readFile(absolutePath, 'utf-8');
    } catch (err) {
      throw new NotFoundException('File not found');
    }
  }

  async writeFile(projectId: string, relativePath: string, content: string) {
    const absolutePath = await this.validatePath(projectId, relativePath);
    try {
      await fs.writeFile(absolutePath, content, 'utf-8');
      return { success: true };
    } catch (err) {
      throw new ForbiddenException('Could not write file');
    }
  }
}

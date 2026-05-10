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
    
    const getFiles = async (dir: string, base: string = ''): Promise<any[]> => {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      const files = await Promise.all(
        entries
          .filter((entry) => !entry.name.startsWith('.') && entry.name !== 'node_modules')
          .map(async (entry) => {
            const res = path.join(dir, entry.name);
            const rel = path.join(base, entry.name);
            const item = {
              name: entry.name,
              isDirectory: entry.isDirectory(),
              path: rel,
            };
            
            if (entry.isDirectory()) {
              const sub = await getFiles(res, rel);
              return [item, ...sub];
            }
            return item;
          }),
      );
      return files.flat();
    };

    try {
      return await getFiles(absolutePath);
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

  async writeFile(projectId: string, relativePath: string, content: string = '') {
    const absolutePath = await this.validatePath(projectId, relativePath);
    try {
      await fs.writeFile(absolutePath, content, 'utf-8');
      return { success: true };
    } catch (err) {
      throw new ForbiddenException('Could not write file');
    }
  }

  async createDirectory(projectId: string, relativePath: string) {
    const absolutePath = await this.validatePath(projectId, relativePath);
    try {
      await fs.mkdir(absolutePath, { recursive: true });
      return { success: true };
    } catch (err) {
      throw new ForbiddenException('Could not create directory');
    }
  }

  async deleteItem(projectId: string, relativePath: string) {
    const absolutePath = await this.validatePath(projectId, relativePath);
    try {
      const stats = await fs.stat(absolutePath);
      if (stats.isDirectory()) {
        await fs.rm(absolutePath, { recursive: true, force: true });
      } else {
        await fs.unlink(absolutePath);
      }
      return { success: true };
    } catch (err) {
      throw new ForbiddenException('Could not delete item');
    }
  }
}

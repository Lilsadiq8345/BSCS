import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Project } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAllForUser(userId: string): Promise<Project[]> {
    const assignments = await this.prisma.projectAssignment.findMany({
      where: { userId },
      include: { project: true },
    });
    return assignments.map((a) => a.project);
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async create(data: { name: string; hostPath: string; description?: string }) {
    return this.prisma.project.create({
      data,
    });
  }

  async assignUser(projectId: string, userId: string) {
    return this.prisma.projectAssignment.create({
      data: { projectId, userId },
    });
  }
}

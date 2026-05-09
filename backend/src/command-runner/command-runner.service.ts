import { Injectable, ForbiddenException } from '@nestjs/common';
import { DockerService } from '../docker/docker.service';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class CommandRunnerService {
  private readonly allowList = ['npm', 'node', 'python', 'ls', 'cat', 'mkdir', 'touch', 'rm', 'pwd', 'echo'];

  constructor(
    private dockerService: DockerService,
    private projectsService: ProjectsService,
  ) {}

  async runCommand(projectId: string, fullCommand: string) {
    const project = await this.projectsService.findOne(projectId);
    const args = fullCommand.split(' ');
    const baseCommand = args[0];

    if (!this.allowList.includes(baseCommand)) {
      throw new ForbiddenException(`Command '${baseCommand}' is not allowed`);
    }

    // Additional check for dangerous flags or sub-commands could be added here

    const container = await this.dockerService.getOrCreateContainer(projectId, project.hostPath);
    const output = await this.dockerService.executeCommand(container.id, args);

    return { output };
  }
}

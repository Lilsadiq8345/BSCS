import { Module } from '@nestjs/common';
import { CommandRunnerService } from './command-runner.service';
import { CommandRunnerController } from './command-runner.controller';
import { DockerModule } from '../docker/docker.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [DockerModule, ProjectsModule],
  providers: [CommandRunnerService],
  controllers: [CommandRunnerController],
})
export class CommandRunnerModule {}

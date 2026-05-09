import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CommandRunnerService } from './command-runner.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('commands')
@UseGuards(JwtAuthGuard)
export class CommandRunnerController {
  constructor(private commandRunnerService: CommandRunnerService) {}

  @Post(':projectId/run')
  async run(@Param('projectId') projectId: string, @Body() body: { command: string }) {
    return this.commandRunnerService.runCommand(projectId, body.command);
  }
}

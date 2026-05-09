import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { FilesModule } from './files/files.module';
import { DockerModule } from './docker/docker.module';
import { CommandRunnerModule } from './command-runner/command-runner.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { LogsModule } from './logs/logs.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PrismaModule,
    ProjectsModule,
    FilesModule,
    DockerModule,
    CommandRunnerModule,
    MonitoringModule,
    LogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

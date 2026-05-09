import { Module } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { MonitoringController } from './monitoring.controller';
import { DockerModule } from '../docker/docker.module';

@Module({
  imports: [DockerModule],
  providers: [MonitoringService],
  controllers: [MonitoringController],
})
export class MonitoringModule {}

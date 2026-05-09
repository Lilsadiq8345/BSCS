import { Injectable } from '@nestjs/common';
import { DockerService } from '../docker/docker.service';
import * as Docker from 'dockerode';

@Injectable()
export class MonitoringService {
  private docker: Docker;

  constructor(private dockerService: DockerService) {
    this.docker = new Docker({
      socketPath: process.env.DOCKER_SOCKET_PATH || '/var/run/docker.sock',
    });
  }

  async getStats() {
    const containers = await this.docker.listContainers();
    const stats = await Promise.all(
      containers.map(async (c) => {
        const container = this.docker.getContainer(c.Id);
        const s: any = await container.stats({ stream: false });
        return {
          id: c.Id,
          name: c.Names[0],
          cpu: this.calculateCpuPercent(s),
          memory: s.memory_stats.usage,
          memoryLimit: s.memory_stats.limit,
        };
      }),
    );

    return {
      activeContainers: containers.length,
      containerStats: stats,
    };
  }

  private calculateCpuPercent(stats: any) {
    const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
    const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
    if (systemDelta > 0 && cpuDelta > 0) {
      return (cpuDelta / systemDelta) * stats.cpu_stats.online_cpus * 100.0;
    }
    return 0;
  }
}

import { Injectable } from '@nestjs/common';
import { DockerService } from '../docker/docker.service';
import Docker from 'dockerode';
import * as os from 'os';
import * as fs from 'fs/promises';

export interface ContainerMetric {
  id: string;
  name: string;
  cpu: string;
  memory: number;
  memoryLimit: number;
}

export interface SystemStats {
  activeContainers: number;
  containerStats: ContainerMetric[];
  systemLoad: string;
  memoryUsage: string;
  storage: string;
}

interface DockerStats {
  cpu_stats: {
    cpu_usage: {
      total_usage: number;
    };
    system_cpu_usage: number;
    online_cpus?: number;
  };
  precpu_stats: {
    cpu_usage: {
      total_usage: number;
    };
    system_cpu_usage: number;
  };
  memory_stats: {
    usage: number;
    limit: number;
  };
}

@Injectable()
export class MonitoringService {
  private docker: Docker;

  constructor(private dockerService: DockerService) {
    this.docker = new Docker({
      socketPath: process.env.DOCKER_SOCKET_PATH || '/var/run/docker.sock',
    });
  }

  async getStats(): Promise<SystemStats> {
    let containers: Docker.ContainerInfo[] = [];
    let stats: ContainerMetric[] = [];
    
    try {
      containers = await this.docker.listContainers();
      stats = await Promise.all(
        containers.map(async (c) => {
          const container = this.docker.getContainer(c.Id);
          const s = await container.stats({ stream: false }) as unknown as DockerStats;
          return {
            id: c.Id,
            name: c.Names[0],
            cpu: this.calculateCpuPercent(s).toFixed(1) + '%',
            memory: s.memory_stats.usage,
            memoryLimit: s.memory_stats.limit,
          };
        }),
      );
    } catch (err) {
      // Docker is not running or not accessible. 
      // We catch this gracefully so the rest of the host metrics still work.
    }

    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memoryUsageStr = `${(usedMem / 1024 / 1024 / 1024).toFixed(1)} GB`;

    const cpus = os.cpus();
    const loadAvg = os.loadavg()[0];
    const systemLoadPct = Math.min(100, Math.round((loadAvg / cpus.length) * 100)) + '%';

    let storageStr = 'Unknown';
    try {
      if (typeof fs.statfs === 'function') {
        const statfs = await fs.statfs('/');
        const totalSpace = Number(statfs.blocks) * Number(statfs.bsize);
        const freeSpace = Number(statfs.bfree) * Number(statfs.bsize);
        const usedSpace = totalSpace - freeSpace;
        storageStr = `${(usedSpace / 1024 / 1024 / 1024).toFixed(1)} GB`;
      } else {
        storageStr = 'N/A';
      }
    } catch (e) {
      storageStr = 'N/A';
    }

    return {
      activeContainers: containers.length,
      containerStats: stats,
      systemLoad: systemLoadPct,
      memoryUsage: memoryUsageStr,
      storage: storageStr,
    };
  }

  private calculateCpuPercent(stats: DockerStats): number {
    if (!stats?.cpu_stats?.cpu_usage || !stats?.precpu_stats?.cpu_usage) {
      return 0;
    }
    const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
    const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
    
    if (systemDelta > 0 && cpuDelta > 0) {
      return (cpuDelta / systemDelta) * (stats.cpu_stats.online_cpus || 1) * 100.0;
    }
    return 0;
  }
}

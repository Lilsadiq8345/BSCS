import { Injectable, OnModuleInit } from '@nestjs/common';
import Docker from 'dockerode';

@Injectable()
export class DockerService implements OnModuleInit {
  private docker: Docker;

  onModuleInit() {
    this.docker = new Docker({ socketPath: process.env.DOCKER_SOCKET_PATH || '/var/run/docker.sock' });
  }

  async getOrCreateContainer(projectId: string, hostPath: string, image: string = 'node:18-slim') {
    const containerName = `code-server-project-${projectId}`;
    const containers = await this.docker.listContainers({ all: true });
    let container = containers.find((c) => c.Names.includes(`/${containerName}`));

    if (!container) {
      const newContainer = await this.docker.createContainer({
        Image: image,
        name: containerName,
        Tty: true,
        Cmd: ['/bin/sh'],
        HostConfig: {
          Binds: [`${hostPath}:/workspace`],
          Memory: 512 * 1024 * 1024, // 512MB limit
          CpuPeriod: 100000,
          CpuQuota: 50000, // 0.5 CPU limit
        },
        WorkingDir: '/workspace',
      });
      await newContainer.start();
      return newContainer;
    }

    const containerInstance = this.docker.getContainer(container.Id);
    if (container.State !== 'running') {
      await containerInstance.start();
    }
    return containerInstance;
  }

  async executeCommand(containerId: string, command: string[]) {
    const container = this.docker.getContainer(containerId);
    const exec = await container.exec({
      Cmd: command,
      AttachStdout: true,
      AttachStderr: true,
    });

    const stream = await exec.start({});
    return new Promise((resolve, reject) => {
      let output = '';
      stream.on('data', (chunk) => {
        output += chunk.toString();
      });
      stream.on('end', () => resolve(output));
      stream.on('error', (err) => reject(err));
    });
  }
}

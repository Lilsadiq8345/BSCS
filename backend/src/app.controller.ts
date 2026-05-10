import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('health')
  checkHealth() {
    return {
      status: 'up',
      timestamp: new Date().toISOString(),
      service: 'BSCS Backend',
      version: '2.0.0',
    };
  }
}

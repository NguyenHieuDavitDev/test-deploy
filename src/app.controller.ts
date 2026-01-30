import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  root() {
    return {
      message: 'NestJS API is running',
      status: 'ok',
    };
  }

  @Get('health')
  health() {
    return {
      status: 'healthy',
      uptime: process.uptime(),
    };
  }
}

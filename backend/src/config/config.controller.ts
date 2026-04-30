import { Controller, Get } from '@nestjs/common';

@Controller('config')
export class ConfigController {
  @Get('world-cup')
  getWorldCupDate() {
    return { startDate: '2026-06-11T00:00:00Z' };
  }
}

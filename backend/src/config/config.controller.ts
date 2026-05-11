import { Controller, Get } from '@nestjs/common';

@Controller('config')
export class ConfigController {
  @Get('world-cup')
  getWorldCupDate() {
    // 11 de Junho de 2026 às 16:00 no fuso UTC-3 (Brasília)
    return { startDate: '2026-06-11T16:00:00-03:00' };
  }
}
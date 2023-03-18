import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ScheduleRootService {
  private readonly logger = new Logger(ScheduleRootService.name);

  /**
   * Se ejecuta un proceso todos los dias a las 15:00 hora de Santiago Chile
   */
  @Cron('00 00 15 * * *', {
    name: 'se ejecuta 15:00',
    timeZone: 'America/Santiago'
  })
  handleCron() {
    this.logger.debug('Se ejecuto el servicio');
  }
}

import { Module } from '@nestjs/common';
import { ScheduleRootService } from './schedule-root.service';
import { ScheduleRootController } from './schedule-root.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  controllers: [ScheduleRootController],
  providers: [ScheduleRootService],
  imports: [
    ScheduleModule.forRoot()
  ]
})
export class ScheduleRootModule {}

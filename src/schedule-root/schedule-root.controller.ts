import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ScheduleRootService } from './schedule-root.service';

@Controller('schedule-root')
export class ScheduleRootController {
  constructor(private readonly scheduleRootService: ScheduleRootService) {}

}

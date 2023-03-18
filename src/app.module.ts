import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GetDataModule } from './get-data/get-data.module';
import { ScheduleRootModule } from './schedule-root/schedule-root.module';

@Module({
  imports: [GetDataModule, ScheduleRootModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

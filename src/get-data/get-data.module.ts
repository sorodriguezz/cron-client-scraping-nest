import { Module } from '@nestjs/common';
import { GetDataService } from './get-data.service';
import { GetDataController } from './get-data.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [GetDataController],
  providers: [GetDataService],
  imports: [HttpModule]
})
export class GetDataModule {}

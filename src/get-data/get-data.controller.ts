import { Controller, Get, Param } from "@nestjs/common";
import { GetDataService } from "./get-data.service";
import { firstValueFrom } from "rxjs";
import * as moment from 'moment';

@Controller("get-data")
export class GetDataController {
  constructor(private readonly getDataService: GetDataService) {}

  @Get()
  async obtenerDatoWeb() {

    const today: any = (moment());
    const parseFechaActual: any = today.format('YYYY-MM-DD')
    // const parseFechaActual: any = "20230317";


    const url = `https://reports.xymarketing.simtastic.cl/parques/parques/parques_${parseFechaActual}212701.txt`;

    console.log(url);

    const data: any = await firstValueFrom(await this.getDataService.fetchDataFromWeb(url));
    console.log(data);

    const lines: any = data.trim().split("\n").splice(1);

    const records: any = lines.map((line: any) => {

      // const fields = line.split(/\t|\s{4,}/);
      const fields: any = line.split("\t").map((s:any) => s.replace(/\r$/, ""));

      return {
        call_date: fields[0],
        phone_number_dialed: fields[1],
        status: fields[2],
        user: fields[3],
        full_name: fields[4],
        campaign_id: fields[5],
        vendor_lead_code: fields[6],
        source_id: fields[7],
        list_id: fields[8],
        gmt_offset_now: fields[9],
        phone_code: fields[10],
        phone_number: fields[11],
        title: fields[12],
        first_name: fields[13],
        middle_initial: fields[14],
        last_name: fields[15],
        address1: fields[16],
        address2: fields[17],
        address3: fields[18],
        city: fields[19],
        state: fields[20],
        province: fields[21],
        postal_code: fields[22],
        country_code: fields[23],
        gender: fields[24],
        date_of_birth: fields[25],
        alt_phone: fields[26],
        email: fields[27],
        security_phrase: fields[28],
        comments: fields[29],
        length_in_sec: fields[30],
        user_group: fields[31],
        alt_dial: fields[32],
        rank: fields[33],
        owner: fields[34],
        lead_id: fields[35],
        list_name: fields[36],
        list_description: fields[37],
        status_name: fields[38],
      };
    });

    console.log(records[0]);

    return "listo";
  }
}

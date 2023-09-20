import { Controller, Get } from "@nestjs/common";
import { GetDataService } from "./get-data.service";
import { firstValueFrom } from 'rxjs';
import puppeteer from "puppeteer";
import * as fs from "fs";

@Controller("get-data")
export class GetDataController {
  private startDate: Date;
  private today: Date;

  constructor(private readonly getDataService: GetDataService) {
    this.startDate = new Date(2023, 8, 6); // 6 de septiembre de 2023
    this.today = new Date();
  }

  private differenceInDays(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round((date2.getTime() - date1.getTime()) / oneDay);
  }

  @Get("inicial")
  async obtenerDatoWebInicial() {
    const url = `url_sitio`;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const anchors = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll("a"));
      return anchors.map((anchor) => anchor.innerText);
    });

    await browser.close();

    return anchors[anchors.length - 1]; // Se otiene siempre el ultimo nombre del archivo registrado
  }

  @Get()
  async obtenerDatoWeb() {
    let currentDate = new Date(this.startDate);
    const daysDifference = this.differenceInDays(this.startDate, this.today);

    for (let i = 0; i <= daysDifference; i++) {
      // Crear la URL basada en la fecha
      const formattedDate = `${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, "0")}${String(currentDate.getDate()).padStart(2, "0")}`;
      const url = `https://reports.xymarketing.simtastic.cl/parques/parques/parques_${formattedDate}.txt`;
      try {
        const registros = await this.obtenerDatosWeb(url, formattedDate);
        const inserts = this.generarSQL(registros);
        this.generarArchivo(inserts, formattedDate);
      } catch (error) {
        console.log(`No existe registro para el dia ${formattedDate}`);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return "listo";
  }

  generarSQL(data: any[]) {
    const keys = Object.keys(data[0]).join(', ');

    const insertStatements = data.map(entry =>
        `INSERT INTO PRISMA.PRM_CARGA_XY (${keys}) VALUES (${Object.values(entry).map(value => `'${value}'`).join(', ')});`
    ).join('\n');

    return insertStatements;
  }

  async generarArchivo(sqlStatement: any, date: string) {
    try {
      await fs.promises.writeFile(`data/parques_${date}.sql`, sqlStatement);
    } catch (error) {
      console.log(error);
    }
  }

  private async obtenerDatosWeb(url: string, date: string) {
    const data: any = await firstValueFrom(
      await this.getDataService.fetchDataFromWeb(url)
    );

    const lines: any = data.trim().split("\n").splice(1); // Se elimina la primera linea del archivo y se separa por saltos de linea

    const records: any = lines.map((line: any) => {
      const fields: any = line
        .split("\t")
        .map((s: any) => s.replace(/\r$/, "")); // Se separa por tabulaciones y se elimina el ultimo caracter de cada linea

      return {
        call_date: fields[0].replace(/'/g, ""),
        phone_number_dialed: fields[1].replace(/'/g, ""),
        status: fields[2].replace(/'/g, ""),
        user_xy: fields[3].replace(/'/g, ""),
        full_name: fields[4].replace(/'/g, ""),
        campaign_id: fields[5].replace(/'/g, ""),
        vendor_lead_code: fields[6].replace(/'/g, ""),
        source_id: fields[7].replace(/'/g, ""),
        list_id: fields[8].replace(/'/g, ""),
        gmt_offset_now: fields[9].replace(/'/g, ""),
        phone_code: fields[10].replace(/'/g, ""),
        phone_number: fields[11].replace(/'/g, ""),
        title: fields[12].replace(/'/g, ""),
        first_name: fields[13].replace(/'/g, ""),
        middle_initial: fields[14].replace(/'/g, ""),
        last_name: fields[15].replace(/'/g, ""),
        address1: fields[16].replace(/'/g, ""),
        address2: fields[17].replace(/'/g, ""),
        address3: fields[18].replace(/'/g, ""),
        city: fields[19].replace(/'/g, ""),
        state: fields[20].replace(/'/g, ""),
        province: fields[21].replace(/'/g, ""),
        postal_code: fields[22].replace(/'/g, ""),
        country_code: fields[23].replace(/'/g, ""),
        gender: fields[24].replace(/'/g, ""),
        date_of_birth: fields[25].replace(/'/g, ""),
        alt_phone: fields[26].replace(/'/g, ""),
        email: fields[27].replace(/'/g, ""),
        security_phrase: fields[28].replace(/'/g, ""),
        comments: fields[29].replace(/'/g, ""),
        lenght_insec: fields[30].replace(/'/g, ""),
        user_group: fields[31].replace(/'/g, ""),
        alt_dial: fields[32].replace(/'/g, ""),
        rank: fields[33].replace(/'/g, ""),
        owner: fields[34].replace(/'/g, ""),
        lead_id: fields[35].replace(/'/g, ""),
        list_name: fields[36].replace(/'/g, ""),
        list_description: fields[37].replace(/'/g, ""),
        status_name: fields[38].replace(/'/g, ""),
        prm_carga_xy_log_nombre_arch: `parques_${date}.txt`,
      };
    });
    return records;
  }
}

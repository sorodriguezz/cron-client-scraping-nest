import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { catchError, map } from "rxjs";

@Injectable()
export class GetDataService {
  constructor(private readonly httpService: HttpService) {}

  async fetchDataFromWeb(url: string) {
    const response: any = this.httpService
      .get(url)
      .pipe(
        map((axiosResponse: any) => axiosResponse.data),
        catchError((error: any) => error.data)
      );

    return response;
  }
}

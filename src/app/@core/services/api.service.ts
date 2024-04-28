import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AppConfig } from 'src/app/@utils/const/app.config';
@Injectable({
  providedIn: 'root'
})



export class ApiService {

  headersObj: any;
  options: any;
  constructor(private http: HttpClient) { }

  getHeader() {
    this.headersObj = new HttpHeaders()
      .set('Content-Type', 'application/json; charset=utf-8')
      .set('org_id', '3')
    let header = {
      headers: this.headersObj
    };
    return header;
  }

  getFileHeader() {
    this.headersObj = new HttpHeaders()
    .set('org_id', '3')
    let header = {
      headers: this.headersObj,
    };
    return header;
  }

  public get(url: string, options?: any) {
    return this.http.get(AppConfig.apiBaseUrl + url, this.getHeader());
  }

  public post(url: string, data: any, options?: any) {
    return this.http.post(AppConfig.apiBaseUrl + url, data, this.getHeader());
  }

  public put(url: string, data: any, options?: any) {
    return this.http.put(AppConfig.apiBaseUrl + url, data, this.getHeader());
  }

  public patch(url: string, data: any, options?: any) {
    return this.http.patch(AppConfig.apiBaseUrl + url, data, this.getHeader());
  }

  public delete(url: string, options?: any) {
    return this.http.delete(AppConfig.apiBaseUrl + url, this.getHeader());
  }

  public fileupload(url: string, data: any, options?: any) {
    return this.http.post(AppConfig.apiBaseUrl + url, data, this.getFileHeader());
  }

}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AppConfig } from '../../@utils/const/app.config';
import { AlertService } from './alert.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInUserSubject!: BehaviorSubject<any>;
  public loggedInUser!: Observable<any>;
  headersObj: any;
  constructor(private http: HttpClient, private router: Router,
    private alertSvc: AlertService) {
    const loggedInData: any = localStorage.getItem('loginData');
    this.loggedInUserSubject = new BehaviorSubject<any>(JSON.parse(loggedInData));
    this.loggedInUser = this.loggedInUserSubject.asObservable();
  }

  getHeader() {
    this.headersObj = new HttpHeaders()
      .set('Content-Type', 'application/json; charset=utf-8')
      .set('org_id', '3')
    let header = {
      headers: this.headersObj
    };
    return header;
  }

  getRealtorHeader() {
    this.headersObj = new HttpHeaders()
      .set('Content-Type', 'application/json; charset=utf-8')
      .set('org_id', '3')
    let header = {
      headers: this.headersObj
    };
    return header;
  }

  isTokenExpired() {
    return false;
  }

  isLoggedIn() {
    const authToken = this.getToken();
    return (authToken !== null) ? true : false;
  }

  isRealtorLoggedIn() {
    const authToken = this.getRealtorToken();
    return (authToken !== null) ? true : false;
  }

  authenticate(postData: any) {
    return this.http.post<any>(AppConfig.apiBaseUrl + AppConfig.apiUrl.customerPortal.authenticateCustomerLogin, postData,this.getHeader())
      .pipe(map(response => {
        localStorage.setItem('customer_otp_key', response.otpkey);
        this.loggedInUserSubject.next(response);
        return response;
      }), catchError((err) => {
        //err.statusText = err?.error?.data?.message;
        return throwError(err); //Rethrow it back to component
      }));
  }

  realtorAuthenticate(postData: any) {
    return this.http.post<any>(AppConfig.apiBaseUrl + AppConfig.apiUrl.realtorPortal.authenticateRealtorLogin, postData,this.getRealtorHeader())
      .pipe(map(response => {
        localStorage.setItem('realtor_otp_key', response.otpkey);
        this.loggedInUserSubject.next(response);
        return response;
      }), catchError((err) => {
        //err.statusText = err?.error?.data?.message;
        return throwError(err); //Rethrow it back to component
      }));
  }

  resendloginOTP(postData: any) {
    return this.http.post<any>(AppConfig.apiBaseUrl + AppConfig.apiUrl.customerPortal.resendLoginOtp, postData,this.getHeader())
      .pipe(map(response => {
        return response;
      }), catchError((err) => {
        //err.statusText = err?.error?.data?.message;
        return throwError(err); //Rethrow it back to component
      }));
  }

  resendRealtorLoginOTP(postData: any) {
    return this.http.post<any>(AppConfig.apiBaseUrl + AppConfig.apiUrl.realtorPortal.resendLoginOtp, postData,this.getHeader())
      .pipe(map(response => {
        return response;
      }), catchError((err) => {
        //err.statusText = err?.error?.data?.message;
        return throwError(err); //Rethrow it back to component
      }));
  }

  validateOTP(postData: any) {
    return this.http.post<any>(AppConfig.apiBaseUrl + AppConfig.apiUrl.customerPortal.validateOTP, postData,this.getHeader())
      .pipe(map(response => {
        if (response.status==1) {
          localStorage.setItem('token', response.token);
          localStorage.removeItem('system_admin_token');
        }
        return response;
      }), catchError((err) => {
        //err.statusText = err?.error?.data?.message;
        return throwError(err); //Rethrow it back to component
      }));
  }

  validateRealtorOTP(postData: any) {
    return this.http.post<any>(AppConfig.apiBaseUrl + AppConfig.apiUrl.realtorPortal.validateOTP, postData,this.getHeader())
      .pipe(map(response => {
        if (response.status==1) {          
          localStorage.removeItem('token');
          localStorage.removeItem('system_admin_token');
        }
        return response;
      }), catchError((err) => {
        //err.statusText = err?.error?.data?.message;
        return throwError(err); //Rethrow it back to component
      }));
  }

  resendSystemAdminloginOTP(postData: any) {
    return this.http.post<any>(AppConfig.apiBaseUrl + AppConfig.apiUrl.customerPortal.resendLoginOtp, postData,this.getHeader())
      .pipe(map(response => {
        return response;
      }), catchError((err) => {
        //err.statusText = err?.error?.data?.message;
        return throwError(err); //Rethrow it back to component
      }));
  }

  validateSystemAdminOTP(postData: any) {
    return this.http.post<any>(AppConfig.apiBaseUrl + AppConfig.apiUrl.customerPortal.validateOTP, postData,this.getHeader())
      .pipe(map(response => {
        if (response.status==1) {
        localStorage.setItem('system_admin_token', response.token);
        localStorage.removeItem('system_admin_otp_key');
        }
        return response;
      }), catchError((err) => {
        //err.statusText = err?.error?.data?.message;
        return throwError(err); //Rethrow it back to component
      }));
  }

  updateSystemAdminPassword(postData: any) {
    return this.http.post<any>(AppConfig.apiBaseUrl + AppConfig.apiUrl.customerPortal.updatePassword, postData,this.getHeader())
      .pipe(map(response => {
        return response;
      }), catchError((err) => {
        return throwError(err); //Rethrow it back to component
      }));
  }

  // validateUserToken(tokenData: any) {
  //   return this.http.post<any>(AppConfig.apiBaseUrl + AppConfig.apiUrl.customerPortal.activateUser + '/' + tokenData, {})
  //     .pipe(map(response => {
  //       return response;
  //     }), catchError((err) => {
  //       //err.statusText = err?.error?.data?.message;
  //       return throwError(err); //Rethrow it back to component
  //     }));
  // }

  getToken() {
    return localStorage.getItem('customer_token');
  }

  getRealtorToken() {
    return localStorage.getItem('realtor_token');
  }

  getUser() {
    return localStorage.getItem('loginData')!=null ? JSON.parse(localStorage.getItem('loginData')|| '{}') : {};
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('customer_token');
    localStorage.removeItem('realtor_token');
    //localStorage.clear();
    this.loggedInUserSubject.next(null);
   // this.alertSvc.info('You have been logged out!', true);
    this.router.navigate(['customer']);
  }

  realtorLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('customer_token');
    localStorage.removeItem('realtor_token');
    this.loggedInUserSubject.next(null);
    this.router.navigate(['realestate-professional-portal']);
  }

  systemAdminLogout() {
    localStorage.removeItem('system_admin_token');
    //localStorage.clear();
    this.loggedInUserSubject.next(null);
   // this.alertSvc.info('You have been logged out!', true);
    this.router.navigate(['auth/system-admin-login']);
  }

  validateToken() {
    return this.http.post<any>(AppConfig.apiBaseUrl + AppConfig.apiUrl.customerPortal.validateToken, {})
      .pipe(map(response => {
        return response;
      }), catchError((err) => {
        //err.statusText = err?.error?.data?.message;
        this.router.navigateByUrl('/customer');
        return throwError(err); //Rethrow it back to component
      }));
  }

  validateRealtorToken() {
    return this.http.post<any>(AppConfig.apiBaseUrl + AppConfig.apiUrl.realtorPortal.validateToken, {})
      .pipe(map(response => {
        return response;
      }), catchError((err) => {
        //err.statusText = err?.error?.data?.message;
        localStorage.removeItem('realtor_token');
        this.router.navigateByUrl('/realestate-professional-portal');
        return throwError(err); //Rethrow it back to component
      }));
  }

  getUserId() {
    const user = JSON.parse(localStorage.getItem('loginData') || '') || {};
    return user.id;
  }

  getRoleId() {
    const user = JSON.parse(localStorage.getItem('loginData') || '') || {};
    return user.user_role;
  }

  checkUSerRole() {

  }
}

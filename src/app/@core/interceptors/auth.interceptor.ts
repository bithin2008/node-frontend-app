import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { AppConfig } from 'src/app/@utils/const/app.config';
import { AlertService } from '../services/alert.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authSvc: AuthService, private loadingService: LoadingBarService, private alertSvc: AlertService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authToken = localStorage.getItem('customer_token')?this.authSvc.getToken():this.authSvc.getRealtorToken();
    this.loadingService.start()
    //this.alertSvc.clear();
    if(authToken) {
      const clonedReq = request.clone({
        setHeaders: {
          Authorization: 'Bearer '+ authToken
        }
      });
      return next.handle(clonedReq).pipe(
        finalize(() => this.loadingService.start()),
      );
    } else {
      return next.handle(request).pipe(
        finalize(() => setTimeout(() => {
          this.loadingService.complete();
        }, 1000)
        ),
      );
    }
  }
}

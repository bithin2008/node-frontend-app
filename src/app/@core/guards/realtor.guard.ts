import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, CanActivateChild, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AlertService } from 'src/app/@core/services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedService } from '../services/shared.service';

@Injectable({
  providedIn: 'root'
})
export class RealtorGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private shrdSvc: SharedService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
  ) {


  }
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let validateRealtor: any = await this.validateRealtorAuth();
    if (validateRealtor) {
      return true;
    } else {
      return false;
    }


  }

  validateRealtorAuth() {
    return new Promise((resolve, reject) => {
      this.authService.validateRealtorToken().subscribe({
        next: (response: any) => {     
          if (response.status == 1) {             
            this.shrdSvc.updateRealtorData(response);
            resolve(true);
          } else {
           this.authService.realtorLogout()
          }
        }, error: (err: HttpErrorResponse) => {
          console.log(err.error.message);
          reject(err.message);
        },
        complete: () => { }
      });
    })
  }

}

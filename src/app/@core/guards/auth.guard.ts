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
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private shrdSvc: SharedService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
  ) {


  }
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let validateUser: any = await this.validateUserAuth();;
    if (validateUser) {
      return true;
    } else {
      return false;
    }


  }

  validateUserAuth() {
    return new Promise((resolve, reject) => {
      this.authService.validateToken().subscribe({
        next: (response: any) => {
          if (response.status == 1) {             
            this.shrdSvc.updateCustomerData(response);
            resolve(true);
          } else {
           this.authService.logout();
          }
        }, error: (err: HttpErrorResponse) => {
          console.log(err.error.message);
          this.authService.logout();
        },
        complete: () => { }
      });
    })
  }

}

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonService } from '../@core/services/common.service';
import { AlertService } from 'src/app/@core/services/alert.service';
import { Router, Event, NavigationStart, NavigationCancel, NavigationEnd, NavigationError } from '@angular/router';
import { SharedService } from 'src/app/@core/services/shared.service';
import { ApiService } from '../@core/services/api.service';
import { AppConfig } from '../@utils/const/app.config';
import { NavigationService } from '../@core/services/navigation.service';
import * as moment from 'moment';
@Component({
  selector: 'app-customer-portal',
  templateUrl: './customer-portal.component.html'
})
export class CustomerPortalComponent implements OnInit {
  isDropdownVisible = false;
  public lastLoginDetails: any = {};
  public isVisable: boolean = false;
  isOpened = true;
  public customerDetails: any = {};
  public currectYear: any = '';

  constructor(
    private router: Router,
    private alertService: AlertService,
    private apiSvc: ApiService,
    private navService: NavigationService,
    private sharedService: SharedService,
    private commonSvc: CommonService
  ) {
    this.sharedService.sharedCustomerData$.subscribe((response: any) => {
      //  console.log(response);
      if (response) {
        this.customerDetails = response.data;
      }
    })
    this.currectYear = moment().format('YYYY');
  }

  ngAfterViewInit() {
    document.addEventListener('mouseup', (e) => {
      let container: any = document.getElementById('myDropdown');
      if (container) {
        if (!container.contains(e.target)) {
          if (this.isDropdownVisible) {
            this.isDropdownVisible = false
          }
        }
      }
    });

    this.router.events.subscribe((event: Event) => {
      if (!(event instanceof NavigationEnd)) {        
        return;
      }
      switch (true) {
        case event instanceof NavigationStart: {
         
          
          break;
        }
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
        
          this.isVisable=false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  ngOnInit(): void {
    this.getCustomerPortalLastLogin();
  }

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  logoutCustomer() {
    let url = AppConfig.apiUrl.customerPortal.logout;
    this.apiSvc.post(url, {}).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          this.alertService.success(response.message);
          localStorage.clear();
          this.router.navigateByUrl('/customer');
        }
      },
      error: () => {
      },
      complete: () => {
      }
    });


  }

  getCustomerPortalLastLogin() {
    this.apiSvc.get(`${AppConfig.apiUrl.customerPortal.getLastLogin}`, '').subscribe({
      next: (response: any) => {
        this.lastLoginDetails = response.data;
      }
    })
  }

  enableVisibility() {
    this.isVisable = true;
  }

  disableVisibility() {
    this.isVisable = false;
  }

  toggleSideNav() {
    this.navService.showNav$.subscribe((data) => {
      this.isOpened = data;
    });
    if (!this.isOpened) {
      this.navService.showNav();
    } else {
      this.navService.hideNav();
    }
  }


}

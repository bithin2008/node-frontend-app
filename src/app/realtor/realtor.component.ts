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
  selector: 'app-realtor',
  templateUrl: './realtor.component.html',
  styleUrls: ['./realtor.component.scss']
})
export class RealtorComponent {
  isDropdownVisible = false;
  public lastLoginDetails: any = {};
  public isVisable: boolean = false;
  isOpened = true;
  public realtorDetails: any = {};
  public currectYear: any = '';

  constructor(
    private router: Router,
    private alertService: AlertService,
    private apiSvc: ApiService,
    private navService: NavigationService,
    private sharedService: SharedService,
    private commonSvc: CommonService
  ) {
    this.sharedService.sharedRealtorData$.subscribe((response: any) => {
       if (response) {
        this.realtorDetails = response.data;        
      }
    })
  }

  ngAfterViewInit() {
  }

  ngOnInit(): void {
  }

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }






}

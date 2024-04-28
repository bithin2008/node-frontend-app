import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../@core/services/common.service';
import { AlertService } from 'src/app/@core/services/alert.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/@core/services/shared.service';
import { AppConfig } from '../../@utils/const/app.config';
import { ApiService } from 'src/app/@core/services/api.service';
import * as _ from "lodash";

@Component({
  selector: 'app-my-card',
  templateUrl: './my-card.component.html',
  styleUrls: ['./my-card.component.scss']
})
export class MyCardComponent {
  public customerCardList: any = {};
  public customerObj: any = {};
  public loading: boolean = false;
  
  constructor(
    private router: Router,
    private alertService: AlertService,
    private apiSvc: ApiService,
    private sharedService: SharedService,
    private commonSvc: CommonService
  ) {
    this.commonSvc.setTitle('First Premier Home Warranty: Customer Portal- My Cards');
    this.sharedService.sharedCustomerData$.subscribe((response: any) => {
      if (response) {
        this.customerObj = response.data;
      }
    })
  }

  ngOnInit(): void {
    this.getAllCustomerCards();
  }

  getAllCustomerCards() {
    this.apiSvc.post(`${AppConfig.apiUrl.customerPortal.getAllCustomerCards}/${this.customerObj.customer_id}`, '').subscribe({
      next: (response: any) => {
        this.customerCardList = response.data;
      }
    })
  }

  changePrimaryCard(obj: any) {
    this.apiSvc.post(`${AppConfig.apiUrl.customerPortal.updatePrimaryCard}/${obj.customer_card_id}`, '').subscribe({
      next: (response: any) => {
        if (response.status == 1) {
         this.getAllCustomerCards();
          this.alertService.success(response.message);
        } else {
          this.alertService.error(response.message);
        }
      },
      error: () => {
      },
      complete: () => {
        this.getAllCustomerCards()
      }
    });
  }
}

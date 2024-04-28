import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../@core/services/common.service';
import { AlertService } from 'src/app/@core/services/alert.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/@core/services/shared.service';
import { AppConfig } from '../../@utils/const/app.config';
import { ApiService } from 'src/app/@core/services/api.service';
import * as _ from "lodash";
import { UtilityService } from 'src/app/@core/services/utility.service';

@Component({
  selector: 'app-my-claim',
  templateUrl: './my-claim.component.html',
  styleUrls: ['./my-claim.component.scss']
})
export class MyClaimComponent {
  public customerClaimList: any = {};
  public customerObj: any = {};
  public primaryCardObj: any = {};
  public futurePayments: any = [];
  public previousPayments: any = [];
  public completedClaimCount:number=0;
  public completedClaims:any=[];

  public openClaimCount:number=0;
  public openClaims:any=[];
  constructor(
    private router: Router,
    private alertService: AlertService,
    private apiSvc: ApiService,
    private sharedService: SharedService,
    private commonSvc: CommonService,
    private utilityService: UtilityService
  ) {
    this.commonSvc.setTitle('First Premier Home Warranty: Customer Portal- My Claims');
    this.sharedService.sharedCustomerData$.subscribe((response: any) => {
      if (response) {
        this.customerObj = response.data;
      }
    })
  }
  ngOnInit(): void {
    this.getCustomerClaimList();
  }


  getCustomerClaimList() {
    this.apiSvc.post(`${AppConfig.apiUrl.customerPortal.getAllCustomerClaims}/${this.customerObj.customer_id}?sortOrder=DESC`, '').subscribe({
      next: (response: any) => {
        this.customerClaimList = response.data;
        this.customerClaimList.forEach((element:any) => {
          element.policy_details.mobile=this.commonSvc.setUSFormatPhoneNumber(element.policy_details.mobile);
        });

        this.openClaims= _.filter(this.customerClaimList, item => item.claim_ticket_statuses_id !== 4);
        this.openClaimCount =   _.size(_.filter(this.customerClaimList, item => item.claim_ticket_statuses_id !== 4));

       

        this.completedClaims= _.filter(this.customerClaimList,{'claim_ticket_statuses_id':4})
        this.completedClaimCount =   _.size(_.filter(this.customerClaimList,{'claim_ticket_statuses_id':4}));
      }
    })
  }

  openTab(evt: any, tabName: any) {
    var i, tabContent: any, tabLinks;
  
    

    // Hide all tab content
    tabContent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabContent.length; i++) {
    //  tabContent[i].style.display = "none";
      tabContent[i].classList.remove("active");
    }

    // Deactivate all tab links
    tabLinks = document.getElementsByClassName("tab");
    for (i = 0; i < tabLinks.length; i++) {
      tabLinks[i].classList.remove("active");
    }
    let elem:any= evt.target;
    if(elem.tagName=='LI'){
      elem = elem.querySelector('button');
    }
    if(elem.tagName=='SPAN' || elem.tagName=='EM' || elem.tagName=='I'){ 
      elem = elem.parentElement;
    }
    if(!elem.parentElement.classList.contains('active')){
      elem.parentElement.classList.add('active')
    }
    let el: any = document.getElementById(tabName)
  //  el.style.display = "block";
    el.classList.add("active");

  }
}

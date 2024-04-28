import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../@core/services/common.service';
import { AlertService } from 'src/app/@core/services/alert.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/@core/services/shared.service';
import { AppConfig } from '../../@utils/const/app.config';
import { ApiService } from 'src/app/@core/services/api.service';
import * as _ from "lodash";
declare var Swiper: any;
@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss']
})
export class CustomerDashboardComponent {
  public customerDetails: any = {};
  public customerObj: any = {};
  public recentUpcomingPayment: any = {};
  public lastReceivedPayment: any = {};
  public lastReceivedPaymentPolicyDetails: any = [];
public recentUpcomingPaymentPolicyDetails: any = [];


public customerClaimList: any = {};
  public primaryCardObj: any = {};
  public futurePayments: any = [];
  public previousPayments: any = [];
  public completedClaimCount:number=0;

  constructor(
    private router: Router,
    private alertService: AlertService,
    private apiSvc: ApiService,
    private sharedService: SharedService,
    private commonSvc: CommonService
  ) {
    localStorage.removeItem('customer_otp_key')
    this.commonSvc.setTitle('First Premier Home Warranty: Customer Portal- Dashboard');
    this.sharedService.sharedCustomerData$.subscribe((response: any) => {
      if (response) {
        this.customerObj = response.data;
      }
    })
  }

  ngOnInit(): void {
    this.getCustomerDetails();
    this.getCustomerClaimList()
  }


  getCustomerDetails() {
    this.apiSvc.post(`${AppConfig.apiUrl.customerPortal.getCustomerDetails}/${this.customerObj.customer_id}`, '').subscribe({
      next: (response: any) => {
        this.customerDetails = response.data;




        //   // LAST RECEIVED PAYMENT AND POLICIES
        //   let latestPayment = _.chain(this.customerDetails.payment_list)
        //   .filter(item => item.payment_status === 1) // Filter by payment_status
        //   .orderBy(['payment_date'], ['asc']) // Sort by payment_date in ascending order
        //   .value();
        // this.lastReceivedPayment = latestPayment[0];
        // this.lastReceivedPaymentPolicyDetails= _.find(this.customerDetails.policy_list,{'policy_id':this.lastReceivedPayment.policy_id})


        this.customerDetails.policy_list.forEach((policy:any) => {

        // LAST RECEIVED PAYMENT AND POLICIES
        policy.latestPayment = _.chain(this.customerDetails.payment_list)
        .filter(item => item.payment_status === 1 && policy.policy_id==item.policy_id) // Filter by payment_status
        .orderBy(['payment_date'], ['asc']) // Sort by payment_date in ascending order
        .value();
        policy.lastReceivedPayment = policy.latestPayment[0];
        policy.lastReceivedPaymentPolicyDetails= _.find(this.customerDetails.policy_list,{'policy_id': policy.lastReceivedPayment?.policy_id});


        // LATEST UPCOMING PAYMENT AND POLICIES
        policy.recentUpcomingPayment = _.chain(this.customerDetails.payment_list)
        .filter(item => item.payment_status === 4 && policy.policy_id==item.policy_id) // Filter by payment_status
        .orderBy(['payment_date'], ['asc']) // Sort by payment_date in ascending order
        .value();
        if(policy.recentUpcomingPayment[0]){
          policy.recentUpcomingPayment = policy.recentUpcomingPayment[0];
          policy.recentUpcomingPaymentPolicyDetails= _.find(this.customerDetails.policy_list,{'policy_id':policy.lastReceivedPayment?.policy_id})
        }
        });





        setTimeout(() => {
          new Swiper('.policy-slider', {
            autoplay: false,
            loop: false,
            touchRatio: 0,
            spaceBetween: 0,
            paginationType: 'fraction',
            pagination: '.swiperTop-pagination',
            prevButton: '.swiperTop-nav--prev',
            nextButton: '.swiperTop-nav--next',
            slidesPerView: 1,
            speed: 500,
          });

          new Swiper('.swiper-address', {
            autoplay: false,
            loop: false,
            touchRatio: 0,
           // spaceBetween: 10,
            paginationType: 'fraction',
            pagination: '.swiperBot-pagination',
            prevButton: '.swiperBot-nav--prev',
            nextButton: '.swiperBot-nav--next',
            slidesPerView: 1,
            // breakpoints: {
            //   1920: {
            //     slidesPerView: 2,
            //   },
            //   1028: {
            //     slidesPerView: 2,
            //   },
            //   575: {
            //     slidesPerView: 1,
            //   }
            // }
          });

        }, 300);

      }
    })
  }

  getCustomerClaimList() {
    this.apiSvc.post(`${AppConfig.apiUrl.customerPortal.getAllCustomerClaims}/${this.customerObj.customer_id}`, '').subscribe({
      next: (response: any) => {
        this.customerClaimList = response.data;
        this.customerClaimList.forEach((element:any) => {
          element.policy_details.mobile=this.commonSvc.setUSFormatPhoneNumber(element.policy_details.mobile);
        });
        this.completedClaimCount =   _.size(_.filter(this.customerClaimList,{'claim_ticket_statuses_id':4}));
      }
    })
  }
}

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
  selector: 'app-my-policy',
  templateUrl: './my-policy.component.html',
  styleUrls: ['./my-policy.component.scss']
})
export class MyPolicyComponent {
  public customerDetails: any = {};
  public customerObj: any = {};
  public primaryCardObj: any = {};
  public futurePayments: any = [];
  public previousPayments: any = [];
  public isShowAddon:boolean=false;
  constructor(
    private router: Router,
    private alertService: AlertService,
    private apiSvc: ApiService,
    private sharedService: SharedService,
    private commonSvc: CommonService,
    private utilityService: UtilityService
  ) {
    this.commonSvc.setTitle('First Premier Home Warranty: Customer Portal- My Policy');
    this.sharedService.sharedCustomerData$.subscribe((response: any) => {
      if (response) {
        this.customerObj = response.data;
      }
    })
  }
  ngOnInit(): void {
    this.getCustomerDetails();
  };




// const addTooltipElements: NodeListOf<Element> = document.querySelectorAll('.add_tooltip');
// const tooltipElements: NodeListOf<Element> = document.querySelectorAll('.tooltip');

// addTooltipElements.forEach((addTooltipElement: Element) => {
//     addTooltipElement.addEventListener('click', () => {
//         addTooltipElement.forEach((tooltipElement: Element) => {
//             // Toggle the 'hidden' class to show/hide the tooltip
//             tooltipElement.classList.toggle('hidden');
//         });
//     });
// });





  getCustomerDetails() {
    this.apiSvc.post(`${AppConfig.apiUrl.customerPortal.getCustomerDetails}/${this.customerObj.customer_id}`, '').subscribe({
      next: (response: any) => {
        this.customerDetails = response.data;
        this.primaryCardObj = _.filter(this.customerDetails.card_list, { 'primary_card': true });
        this.customerDetails.policy_list.forEach((element: any) => {
          element.optional_item_count = 0;
          element.optional_items = [];
          element.policy_product_list.forEach((obj: any) => {
            if (obj.product_details) {
              if (obj.product_details.product_type == 0) {
                if(element.policy_term_month==1){
                  obj.price=obj.product_details.monthly_price
                }else{
                  obj.price= obj.product_details.yearly_price * (element.policy_term_month/12)
                }
                element.optional_items.push(obj)
                element.optional_item_count++;
              }
            }
          });
        });
        console.log('this.customerDetails', this.customerDetails);
        setTimeout(() => {
          this.utilityService.accordion()
        }, 1000);
      }
    })
  }
}

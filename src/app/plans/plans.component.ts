import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { FormValidationService } from '../@core/services/form-validation.service';
import { ApiService } from '../@core/services/api.service';
import { LoaderService } from '../@core/services/loader.service';
import { AppConfig } from 'src/app/@utils/const/app.config';
import { AlertService } from '../@core/services/alert.service';
import * as _ from "lodash";
import { CommonService } from '../@core/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../@core/services/shared.service';


@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent {
  public loading: boolean = false;
  public planList: any = [];
  public planWiseProductList: any[] = [];
  public addOnProductList: any[] = [];
  public isExpandAddonList: boolean = false;
  activeTerm: string = 'month';
  public showMoreItemAddon: boolean = false;
  public displayedAddonItems: number = 17;
  isExpanded:boolean=false;
  public pageDetails:any={};
  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private formValidationService: FormValidationService,
    private apiService: ApiService,
    private loader: LoaderService,
    private commonSvc: CommonService,
    private sharedService: SharedService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private title: Title, private meta: Meta
  ) {    
    const resolvedData = this.activatedRoute.snapshot.data['routeData'];
    if (resolvedData?.data) {
      this.pageDetails = resolvedData.data
      this.title.setTitle(this.pageDetails?.title);
      this.meta.removeTag('keyword');
      this.meta.removeTag('description');
      this.meta.updateTag({ name: 'description', content: this.pageDetails?.meta_description?this.pageDetails?.meta_description:'' });
      this.meta.updateTag({ name: 'keywords', content: this.pageDetails?.meta_keywords?this.pageDetails?.meta_keywords:'' });
      this.meta.updateTag({ name: 'script', type: 'application/ld+json', content: this.pageDetails.schema_markup? JSON.stringify(this.pageDetails?.schema_markup):'' });
    }
  }
  ngOnInit(): void {
    this.getAllPlans();
    this.getAllAddonProducts();
  }

  // ngAfterViewInit() {
  //     this.commonSvc.gsapInit();

  //     this.commonSvc.gsapBatchB2T();
  //     setTimeout(() => {      
  //       this.commonSvc.gsapTxtRevealAnim();
  //     }, 1000);
  // }


  getAllPlans() {
    this.apiService.get(`${AppConfig.apiUrl.common.getAllPlans}?active_status=1`).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          response.data.forEach((element: any) => {
            if (element.plan_id ==2 || element.plan_id ==1) {
              element.displayedItems = 15;
              this.planList.push(element)
            }
          });
          this.planList.forEach((element: any) => {
            if (element.plan_id ==2) {
              
              element.is_active = true;
            }
            element.product_list.forEach((item: any) => {
              item['plan_id'] = element.plan_id;
              let isExist;
              if (this.planWiseProductList.length > 0) {
                isExist = _.find(this.planWiseProductList, { 'product_id': item.product_id });
              }
              if (isExist) {
                this.planWiseProductList = _.reject(this.planWiseProductList, { 'product_id': item.product_id });
                item['exist_in_both_plan'] = true
              } else {
                item['exist_in_both_plan'] = false
              }
              this.planWiseProductList.push(item);
            });
          });
         // this.planList = this.planList.reverse();
          this.planWiseProductList = _.unionBy(this.planWiseProductList, 'product_id');
          

          let filteredArray: any = _.filter(this.planWiseProductList, { 'exist_in_both_plan': false });

          filteredArray.forEach((item: any) => {
            this.planWiseProductList.forEach((obj: any, index: number) => {
              if (item.product_id == obj.product_id) {
                this.planWiseProductList.splice(index, 1);
                this.planWiseProductList.push(item);
              }
            });
          });
          this.planWiseProductList = this.planWiseProductList.sort((a, b) => {
            if (a.sequence === null && b.sequence !== null) {
              return 1; // Move items with null sequence to the end
            } else if (a.sequence !== null && b.sequence === null) {
              return -1; // Move items with non-null sequence to the beginning
            } else {
              return a.sequence - b.sequence; // Regular sorting for non-null sequences
            }
          });
          this.loading = true;

          this.changeTerm('month');


        } else {
          this.alertService.error(response.message);
        }
      }
    });
  }

  showMore(obj: any) {
    obj.showMoreItem = !obj.showMoreItem;
    if (obj.showMoreItem) {
      obj.displayedItems = this.planWiseProductList.length;
      this.isExpanded=true
    } else {
      obj.displayedItems = 15;
      this.isExpanded=false
    }  

    if(this.showMoreItemAddon){
      this.isExpanded=true;
    }else{
      this.isExpanded=false;
    }
    this.planList.forEach((obj:any) => {
      if(obj.showMoreItem){
        this.isExpanded=true;
      }
    });
    
  }

  showMoreAddon() {
    this.showMoreItemAddon = !this.showMoreItemAddon
    if(this.showMoreItemAddon){
      this.isExpanded=true
    }else{
      this.isExpanded=false
    }
    if (this.showMoreItemAddon) {
      this.displayedAddonItems = this.addOnProductList.length;
    } else {
      this.displayedAddonItems = 17;
    }

    this.planList.forEach((obj:any) => {
      if(obj.showMoreItem){
        this.isExpanded=true;
      }
    });
  }

  getAllAddonProducts() {
    this.apiService.get(`${AppConfig.apiUrl.common.getAllAddonProducts}?active_status=1`).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          this.addOnProductList = response.data;
          this.loading = false;
        } else {
          this.alertService.error(response.message);
        }
      }
    });
  }

  planSelection(obj: any) {
    this.planList.forEach((plan: any, index: number) => {
      plan.is_active = false;
      if (plan.plan_id == obj.plan_id) {
        plan.is_active = true;
      }
    });
  }
  premierPlanPrice: any
  platinumPlanPrice: any

  changeTerm(term: any) {
    this.activeTerm = term
    if (term == 'month') {
      this.planList.forEach((e: any) => {
        if (e.plan_id ==2) {
          e.plan_term.forEach((term: any) => {
            if (term.plan_term_month == 1 && term.property_type_id == Math.min(...e.plan_term.map((o: any) => o.property_type_id))) {
              this.platinumPlanPrice = term.price_below_5000_sqft;
            }
          })
        }
        if (e.plan_id ==1) {
          e.plan_term.forEach((term: any) => {
            if (term.plan_term_month == 1 && term.property_type_id == Math.min(...e.plan_term.map((o: any) => o.property_type_id))) {
              this.premierPlanPrice = term.price_below_5000_sqft;
            }
          })
        }
      })
    } else {
      this.planList.forEach((e: any) => {
        if (e.plan_id ==2) {
          e.plan_term.forEach((term: any) => {
            if (term.plan_term_month == 14 && term.property_type_id == Math.min(...e.plan_term.map((o: any) => o.property_type_id))) {
              this.platinumPlanPrice = term.price_below_5000_sqft;
            }
          })
        }
        if (e.plan_id ==1) {
          e.plan_term.forEach((term: any) => {
            if (term.plan_term_month == 14 && term.property_type_id == Math.min(...e.plan_term.map((o: any) => o.property_type_id))) {
              this.premierPlanPrice = term.price_below_5000_sqft;
            }
          })
        }
      })
    }



  } 
}

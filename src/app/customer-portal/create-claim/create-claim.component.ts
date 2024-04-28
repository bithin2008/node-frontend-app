import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../@core/services/common.service';
import { AlertService } from 'src/app/@core/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/@core/services/shared.service';
import { FormControl, UntypedFormBuilder, FormGroup, Validators, FormArray, NgForm } from '@angular/forms';
import { AppConfig } from '../../@utils/const/app.config';
import { ApiService } from 'src/app/@core/services/api.service';
import * as _ from "lodash";
import { FormValidationService } from 'src/app/@core/services/form-validation.service';
import * as moment from 'moment';
declare var Swiper: any;
@Component({
  selector: 'app-create-claim',
  templateUrl: './create-claim.component.html',
  styleUrls: ['./create-claim.component.scss']
})
export class CreateClaimComponent {
  public loading: boolean = false;
  public submitted: boolean = false;
  public blogList: any = [];
  public claimForm: FormGroup | any
  public claimFormSubmitted: boolean = false;
  public policyId: any = '';
  public policyDetails: any = {};
  public productProblemList: any = [];
  public disableIssueList: boolean = true;
  public activeClaimCount:number =0;
  public customerObj:any={};
  public maxDate:any;
  constructor(
    private router: Router,
    private alertService: AlertService,
    private fb: UntypedFormBuilder,
    private apiSvc: ApiService,
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private commonSvc: CommonService,
    private formValidationSvc: FormValidationService
  ) {
    this.commonSvc.setTitle('First Premier Home Warranty: Customer Portal- File A Claim');
    this.sharedService.sharedCustomerData$.subscribe((response: any) => {
      if (response) {
        this.customerObj = response.data;
      }
    })
    this.activatedRoute.paramMap.subscribe((params) => {
      const encodedId: any = params.get('policyid');
      this.policyId = atob(decodeURIComponent(encodedId));
    });


    this.claimForm = this.fb.group({
      product_id: ['', [Validators.required]],
      product_brand: [''],
      product_model: [''],
      product_serial_no: [''],
      issue_type: ['', [Validators.required]],
      product_purchase_date: [''],
      other_issue_type: [''],
      issue_details: ['', [Validators.required,]],
      ownTechnician: [''],
      iagree:[''],
    });
    this.claimForm.controls['issue_type'].disable({ onlySelf: true });

  }

  async ngOnInit(): Promise<void> {
    this.policyDetails = await this.getPolicyDetails(this.policyId);
    this.getAllBlogs('');
    this.getCustomerClaimList();
    this.maxDate=new Date();
  }

  selectProduct() {
    this.blogList = [];
    if (this.s1['product_id'].value) {
      this.getProductProblems(this.s1['product_id'].value)
      this.getAllBlogs(this.s1['product_id'].value);
      this.claimForm.controls['issue_type'].enable({ onlySelf: true });
    } else {
      this.claimForm.controls['issue_type'].disable({ onlySelf: true });
    }
  }

  changeIssueType() {
    if (this.s1['issue_type'].value == 'others') {
      this.claimForm.controls['other_issue_type'].setValidators([Validators.required])
      this.claimForm.controls['other_issue_type'].updateValueAndValidity()
    } else {
      this.claimForm.controls['other_issue_type'].setValidators(null);
      this.claimForm.controls['other_issue_type'].updateValueAndValidity()
    }
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.claimForm.value);

    if(this.activeClaimCount>0){
      this.alertService.warning(`There are currently ${this.activeClaimCount} open claim(s) that you have. After closing such claim(s), you can file a new claim.`);
      return;
    }
    
    if (!this.claimForm.valid) {
      this.formValidationSvc.validateAllFormFields(this.claimForm);
      return
    }
    if(!this.s1['iagree'].value){
      this.alertService.warning('Please agree with the terms & conditions and service call fee');
      return;
    }
    let formValue: any = { ...this.claimForm.value };
    formValue.priority = 'Urgent';
    formValue.product_purchase_date = this.claimForm.value.product_purchase_date ? moment(this.claimForm.value.product_purchase_date).format("YYYY-MM-DD") : null
    formValue.policy_id = this.policyId;
    formValue.source = 0;
    if (this.s1['issue_type'].value == 'others') {
      formValue.other_issue_type= 'other';
      formValue.issue_type = null;
    }else{
      formValue.other_issue_type= null;
    }
    this.loading=true;
    this.apiSvc.post(`${AppConfig.apiUrl.customerPortal.createClaim}`, formValue).subscribe({
      next: (res: any) => {
        this.loading=false;
        if (res.status == 1) {
          this.claimForm.reset();
          this.alertService.success(res.message);
          this.submitted = false;
          setTimeout(() => {
            this.router.navigate(['/customer-portal/my-claims']);            
          }, 1000);
        } else {
        }
      },
      error: () => { this.loading=false; },
      complete: () => {this.loading=false; }
    });

  }

  get s1() { return this.claimForm.controls; }

  getPolicyDetails(policyId: number) {
    return new Promise<void>((resolve, reject) => {
      this.apiSvc.post(`${AppConfig.apiUrl.customerPortal.policyDetails}/${policyId}`, '').subscribe({
        next: (response: any) => {
          if (response.status == 1) {
            resolve(response.data)
          }
        },
        error: (err) => {
          reject(err)
        },
      })
    })
  }


  getAllBlogs(productId: any) {
    this.apiSvc.get(`${AppConfig.apiUrl.common.getAllPosts}?active_status=1&page=1&limit=8&product_id=${productId}`).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          setTimeout(() => {
            this.blogList = response.data;
          }, 100);
          setTimeout(() => {

            new Swiper('.swiper__blog-container', {

              spaceBetween: 10,
              //truewrapper adoptsheight of active slide
              // Optional parameters
              loop: false,
              // delay between transitions in ms
              autoplay: 4000,
              // If we need pagination
              // pagination: '.swiper-pagination',
              // paginationType: "bullets",
              // // Navigation arrows
              nextButton: '.swiper__blog-container--next',
              prevButton: '.swiper__blog-container--prev',
              // And if we need scrollbar
              //scrollbar: '.swiper-scrollbar',
              // "slide", "fade", "cube", "coverflow" or "flip"
              effect: 'slide',
              slidesPerView: 1
            });
          }, 100);

        } else {
          this.alertService.error(response.message);
        }
      }
    });
  }


  getProductProblems(productId: any) {
    this.apiSvc.post(`${AppConfig.apiUrl.customerPortal.getProductProblems}?product_id=${productId}`, '').subscribe({
      next: (response: any) => {
        this.productProblemList = response.data;
      }
    })
  }

  getCustomerClaimList() {
    this.apiSvc.post(`${AppConfig.apiUrl.customerPortal.getAllCustomerClaims}/${this.customerObj.customer_id}?sortOrder=DESC`, '').subscribe({
      next: (response: any) => {       
        response.data.forEach((element:any) => {
        element.policy_details.mobile=this.commonSvc.setUSFormatPhoneNumber(element.policy_details.mobile);
        });
        this.activeClaimCount = _.size(_.filter(response.data, item => item.claim_ticket_statuses_id !== 4 && item.policy_id==this.policyId));        
      }
    })
  }

}

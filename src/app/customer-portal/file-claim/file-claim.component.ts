import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../@core/services/common.service';
import { AlertService } from 'src/app/@core/services/alert.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/@core/services/shared.service';
import { FormControl, UntypedFormBuilder, FormGroup, Validators, FormArray, NgForm } from '@angular/forms';
import { AppConfig } from '../../@utils/const/app.config';
import { ApiService } from 'src/app/@core/services/api.service';
import * as _ from "lodash";
import { FormValidationService } from 'src/app/@core/services/form-validation.service';
import * as moment from 'moment';
@Component({
  selector: 'app-file-claim',
  templateUrl: './file-claim.component.html',
  styleUrls: ['./file-claim.component.scss']
})
export class FileClaimComponent {
  public customerObj: any = {};
  public customerDetails: any = {};
  public submitted: boolean = false;
  public validZip: boolean = false;
  public validInfoZip: boolean = false;
  public validZipMessage: any = '';
  public validInfoZipMessage: any = '';
  public claimForm: FormGroup | any
  public claimFormSubmitted: boolean = false;
  public showInfoModal: boolean = false;
  public currentPolicyId: any = '';
  public policyDetails: any = {};
  public customerCardsList: any = [];
  public showClaimwarningModal: boolean = false;
  public currentClaimData:any={};
  public claimStatusCheckMsg:any='';
  public multipleClaim:number = 0;
  constructor(
    private router: Router,
    private alertService: AlertService,
    private fb: UntypedFormBuilder,
    private apiSvc: ApiService,
    private sharedService: SharedService,

    private commonSvc: CommonService,
    private formValidationSvc: FormValidationService
  ) {
    this.commonSvc.setTitle('First Premier Home Warranty: Customer Portal- File A Claim');
    this.sharedService.sharedCustomerData$.subscribe((response: any) => {
      if (response) {
        this.customerObj = response.data;
        console.log('this.customerObj', this.customerObj);

      }
    })
  }



  ngOnInit(): void {

    this.getCustomerDetails()
    setTimeout(() => {
      this.formValidationSvc.forms();
    }, 1200);
  }







  onSubmit() {
    this.submitted = true;
    console.log(this.claimForm.value);
    if (!this.claimForm.valid) {
      this.formValidationSvc.validateAllFormFields(this.claimForm);
      return
    }
    let formValue: any = { ...this.claimForm.value };
    formValue.priority='Urgent'; 
    formValue.product_purchase_date = this.claimForm.value.product_purchase_date ? moment(this.claimForm.value.product_purchase_date).format("YYYY-MM-DD") : null
    this.apiSvc.post(`${AppConfig.apiUrl.customerPortal.createClaim}`, formValue).subscribe({
      next: (res: any) => {
        if (res.status == 1) {

          this.getCustomerDetails()
          this.claimForm.reset();
          this.closeInfoModal()
          this.alertService.success(res.message);
          this.submitted = false;

        } else {

        }
      },
      error: () => { },
      complete: () => { }
    });

  }



  get s1() { return this.claimForm.controls; }

  getCustomerDetails() {
    this.apiSvc.post(`${AppConfig.apiUrl.customerPortal.getCustomerDetails}/${this.customerObj.customer_id}`, '').subscribe({
      next: (response: any) => {
        this.customerDetails = response.data;

        this.customerDetails.policy_list.forEach((element: any) => {
          element.hasClaim=false;
          element.mobile = this.commonSvc.setUSFormatPhoneNumber(element.mobile);         
        });

        this.customerDetails.claim_list.forEach((item: any) => {
          this.customerDetails.policy_list.forEach((obj: any) => {
            if(item.policy_id== obj.policy_id && item.claim_ticket_statuses_id!=4){
              obj.hasClaim=true;
            }
          });
        });

        this.claimForm = this.fb.group({
          policy_id: ['', [Validators.required]],
          issue_details: [null, [Validators.required,]],
         // priority: [null, [Validators.required]],
          product_id: [null, [Validators.required]],
          // claim_ticket_statuses_id: [null, [Validators.required]],
          product_purchase_date: [null],
          product_brand: [null],
          product_model: [null],
          product_serial_no: [null],
        //  note: [null]
     });

        // this.stepOneForm.patchValue({
        //   firstName: response.data.first_name,
        //   lastName: response.data.last_name,
        // });
      }
    })
  }

  createClaim(obj:any){
    // if(obj.policy_status!=1){
    //   this.showClaimwarningModal=true;
    //   this.claimStatusCheckMsg='A claim cannot be created while the status is not active.';     
    //   return;
    // }
    const encodedId = encodeURIComponent(btoa(obj.policy_id));
    this.router.navigate([`/customer-portal/create-claim/${encodedId}`]);
  }

  openWarningModal(obj:any){
      this.showClaimwarningModal=true;
      this.multipleClaim=1;
    this.currentClaimData=obj;
  }

  closeClaimwarningModal(){
    this.showClaimwarningModal=false;
    this.claimStatusCheckMsg='';
    this.multipleClaim=0;
  }

  async toggleFileClaimModal(obj: any) {
    this.showInfoModal = !this.showInfoModal;
    this.currentPolicyId = obj.policy_id;
    if (this.showInfoModal) {
      this.policyDetails = await this.getPolicyDetails(this.currentPolicyId);

      this.customerCardsList = await this.getAllCustomerCards(this.policyDetails.customer_id);
      this.claimForm.patchValue({
        policy_id: obj.policy_id,

      });
      setTimeout(() => {
        this.formValidationSvc.forms();
      }, 250);
    }
  }

  closeInfoModal() {
    this.showInfoModal = false;
  }

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

  getAllCustomerCards(customer_id: any) {
    return new Promise<void>((resolve, reject) => {
      this.apiSvc.post(`${AppConfig.apiUrl.customerPortal.getAllCustomerCards}/${customer_id}`, '').subscribe({
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

 
}

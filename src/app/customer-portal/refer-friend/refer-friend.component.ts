import { Component } from '@angular/core';
import { FormValidationService } from '../../@core/services/form-validation.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../@core/services/alert.service';
import { ApiService } from '../../@core/services/api.service';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/@utils/const/app.config';
import { CommonService } from '../../@core/services/common.service';
import { SharedService } from 'src/app/@core/services/shared.service';

@Component({
  selector: 'app-refer-friend',
  templateUrl: './refer-friend.component.html',
  styleUrls: ['./refer-friend.component.scss']
})
export class ReferFriendComponent {
  public referFriendForm!: FormGroup;
  public referFriendFormSubmitted: boolean = false;
  public customerDetails:any=[];
  public customerObj: any = {};
  public loading : boolean =false;
  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private formValidationService: FormValidationService,
    private apiService: ApiService,
    private sharedService: SharedService,
    private router: Router,
    private commonSvc: CommonService,
  ) {
    this.commonSvc.setTitle('First Premier Home Warranty: Customer Portal- Refer A Friend');
    this.sharedService.sharedCustomerData$.subscribe((response: any) => {
      if (response) {
        this.customerObj = response.data;
      }
    })
    this.referFriendForm = this.fb.group({
      fullName: ['', [Validators.required, this.formValidationService.notEmpty]],     
      emailId: ['', [Validators.required, this.formValidationService.notEmpty, this.formValidationService.validEmail]],
      friendFullName: ['', [Validators.required, this.formValidationService.notEmpty]],     
      friendEmailId: ['', [Validators.required, this.formValidationService.notEmpty, this.formValidationService.validEmail]],
      friendMobileNo: ['', [this.formValidationService.phoneNumberUS,]],
    });
  }

  get s1() { return this.referFriendForm.controls; }

  ngAfterViewInit() {
    this.formValidationService.forms();
    this.getCustomerDetails();
  }

  getCustomerDetails() {
    this.apiService.post(`${AppConfig.apiUrl.customerPortal.getCustomerDetails}/${this.customerObj.customer_id}`, '').subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          this.customerDetails = response.data;
          this.referFriendForm.patchValue({
            fullName: this.customerDetails.first_name +' '+this.customerDetails.last_name,
            emailId: this.customerDetails.email
          });
          this.formValidationService.forms();
        } else {
          this.alertService.error(response.message);
        }
      }
    })
  }

  changePhoneFormat(e: any) {
    this.referFriendForm.controls['friendMobileNo'].setValue(this.commonSvc.setUSFormatPhoneNumber(e.target.value.toString()));
  }

  referFriendSubmit(){
    if (!this.referFriendForm.valid) {
      this.formValidationService.validateAllFormFields(this.referFriendForm);
      return
    } 
    let data={
      fullName:this.referFriendForm.value.fullName,
      emailId:this.referFriendForm.value.emailId,
      friendFullName:this.referFriendForm.value.friendFullName,
      friendEmailId:this.referFriendForm.value.friendEmailId,
      friendMobileNo : this.commonSvc.convertToNormalPhoneNumber(this.referFriendForm.value.friendMobileNo),
      policyNumber: this.customerDetails.policy_list[0].policy_number,
      purchaseDate:this.customerDetails.policy_list[0].order_date,
      policyStatus:this.customerDetails.policy_list[0].policy_status,
      createUserType:1,
      createdBy: this.customerDetails.customer_id
    }
    this.apiService.post(`${AppConfig.apiUrl.customerPortal.createReferFriend}`, data).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.status == 1) {
          this.referFriendForm.reset();
          this.router.navigate(['/customer-portal/refer-a-friend-thankyou']);
        }else {
          this.alertService.error(response.message);
        }
      },
      error: () => { this.loading = false; },
      complete: () => { this.loading = false; }
    });
  }

}

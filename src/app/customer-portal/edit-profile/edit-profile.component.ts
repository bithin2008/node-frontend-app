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
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent {
  public customerObj: any = {};
  public customerDetails: any = {};
  public submitted: boolean = false;
  public validZip: boolean = false;
  public validInfoZip: boolean = false;
  public validZipMessage: any = '';
  public validInfoZipMessage: any = '';
  public policyInfoForm!: FormGroup;
  public policyInfoFormSubmitted: boolean = false;
  public showInfoModal: boolean = false;
  public currentPolicyId: any = '';

  constructor(
    private router: Router,
    private alertService: AlertService,
    private fb: UntypedFormBuilder,
    private apiSvc: ApiService,
    private sharedService: SharedService,

    private commonSvc: CommonService,
    private formValidationSvc: FormValidationService
  ) {
    this.commonSvc.setTitle('First Premier Home Warranty: Customer Portal- Edit Profile');
    this.sharedService.sharedCustomerData$.subscribe((response: any) => {
      if (response) {
        this.customerObj = response.data;
        console.log('this.customerObj', this.customerObj);

      }
    })
  }

  editProfileForm = this.fb.group({
    firstName: ['', [Validators.required, this.formValidationSvc.notEmpty]],
    lastName: ['', [Validators.required, this.formValidationSvc.notEmpty]],
    emailId: ['', [Validators.required, this.formValidationSvc.notEmpty, this.formValidationSvc.validEmail,]],
    mobileNo: ['', [Validators.required, this.formValidationSvc.phoneNumberUS,]],
    alternatePhone: ['', [this.formValidationSvc.phoneNumberUS,]],
    address1: ['', [Validators.required, this.formValidationSvc.notEmpty]],
    city: ['', [Validators.required, this.formValidationSvc.notEmpty]],
    state: ['', [Validators.required, this.formValidationSvc.notEmpty]],
    zip: ['', [Validators.required, this.formValidationSvc.notEmpty]]
  })

  get f() { return this.editProfileForm.controls; }

  ngOnInit(): void {
    this.editProfileForm.patchValue({
      firstName: this.customerObj.first_name,
      lastName: this.customerObj.last_name,
      emailId: this.customerObj.email,
      alternatePhone: this.customerObj.alternate_phone ? this.commonSvc.setUSFormatPhoneNumber(this.customerObj.alternate_phone) : null,
      mobileNo: this.commonSvc.setUSFormatPhoneNumber(this.customerObj.mobile),
      address1: this.customerObj.address1,
      city: this.customerObj.city,
      state: this.customerObj.state,
      zip: this.customerObj.zip
    });
    this.getCustomerDetails()
   
  }
  ngAfterViewInit() {
    setTimeout(() => {
          this.formValidationSvc.forms();
      console.log('called');
      
    }, 2000);
  }
  changePhoneFormat(e: any) {
    this.editProfileForm.controls['mobileNo'].setValue(this.commonSvc.setUSFormatPhoneNumber(e.target.value.toString()));
  }

  changeAlterPhoneFormat(e: any) {
    this.editProfileForm.controls['alternatePhone'].setValue(this.commonSvc.setUSFormatPhoneNumber(e.target.value.toString()));
  }

  chekcZipCode(ev: any) {
    if (ev.target.value.length > 4) {
      this.validZip = false;
      this.validZipMessage = '';
      this.apiSvc.post(AppConfig.apiUrl.common.locationByZip, { zip: ev.target.value.toString() }).subscribe({
        next: (response: any) => {
          if (response.status == 1) {
            if (response.data.is_serviceable == 1 && response.data.active_status == 1) {
              this.validZip = true;
              this.editProfileForm.patchValue({
                state: response.data.state,
                city: response.data.city
              });
              this.formValidationSvc.forms();
            } else {
              this.validZipMessage = 'Unavailable services in this zip code';
            }
          } else {
            this.validZipMessage = response.message;
            this.editProfileForm.patchValue({
              state: '',
              city: ''
            });
          }
        },
        error: () => {
        },
        complete: () => {
          if (!this.validZip) {
            this.editProfileForm.patchValue({
              state: '',
              city: ''
            });
          }
        }
      });
    } else {
      this.validZipMessage = '';
      this.editProfileForm.patchValue({
        state: '',
        city: ''
      });
    }
  }

  chekcZipCodeForPolicy(ev: any) {
    if (ev.target.value.length > 4) {
      this.validInfoZip = false;
      this.validInfoZipMessage = '';
      this.apiSvc.post(AppConfig.apiUrl.common.locationByZip, { zip: ev.target.value.toString() }).subscribe({
        next: (response: any) => {
          if (response.status == 1) {
            if (response.data.is_serviceable == 1 && response.data.active_status == 1) {
              this.validInfoZip = true;
              this.policyInfoForm.patchValue({
                state: response.data.state,
                city: response.data.city
              });
              this.formValidationSvc.forms();
            } else {
              this.validInfoZipMessage = 'Unavailable services in this zip code';
            }
          } else {
            this.validInfoZipMessage = response.message;
            this.policyInfoForm.patchValue({
              state: '',
              city: ''
            });
          }
        },
        error: () => {
        },
        complete: () => {
          if (!this.validInfoZip) {
            this.policyInfoForm.patchValue({
              state: '',
              city: ''
            });
          }
        }
      });
    } else {
      this.validInfoZipMessage = '';
      this.policyInfoForm.patchValue({
        state: '',
        city: ''
      });
    }
  }



  onSubmit() {
    this.submitted = true
    if (!this.editProfileForm.valid) {
      this.formValidationSvc.validateAllFormFields(this.editProfileForm);
      return
    }
    this.editProfileForm.value.mobileNo = this.commonSvc.convertToNormalPhoneNumber(this.f['mobileNo'].value);
    this.apiSvc.put(`${AppConfig.apiUrl.customerPortal.updateCustomerProfile}`, this.editProfileForm.value).subscribe({
      next: (response: any) => {
        console.log('response', response);
        if (response.status == 1) {
          this.alertService.success(response.message);
        } else {
          this.alertService.error(response.message);
        }
      }
    });
  }

  changeMobileFormat(e: any) {
    this.policyInfoForm.controls['mobileNo'].setValue(this.commonSvc.setUSFormatPhoneNumber(e.target.value.toString()));
  }

  get s1() { return this.policyInfoForm.controls; }

  getCustomerDetails() {
    this.apiSvc.post(`${AppConfig.apiUrl.customerPortal.getCustomerDetails}/${this.customerObj.customer_id}`, '').subscribe({
      next: (response: any) => {
        this.customerDetails = response.data;

        this.customerDetails.policy_list.forEach((element: any) => {
          element.mobile = this.commonSvc.setUSFormatPhoneNumber(element.mobile);
        });

        this.policyInfoForm = this.fb.group({
          firstName: ['', [Validators.required, this.formValidationSvc.notEmpty]],
          lastName: ['', [Validators.required, this.formValidationSvc.notEmpty]],
          emailId: ['', [Validators.required, this.formValidationSvc.notEmpty, this.formValidationSvc.validEmail]],
          mobileNo: ['', [Validators.required, this.formValidationSvc.phoneNumberUS,]]
        });

        // this.stepOneForm.patchValue({
        //   firstName: response.data.first_name,
        //   lastName: response.data.last_name,
        // });
      }
    })
  }

  policyInfoSubmit() {
    this.policyInfoFormSubmitted = true;
    if (!this.policyInfoForm.valid) {
      this.formValidationSvc.validateAllFormFields(this.policyInfoForm);
      return
    }

    this.policyInfoForm.value.mobileNo = this.commonSvc.convertToNormalPhoneNumber(this.policyInfoForm.value.mobileNo);
    this.apiSvc.put(`${AppConfig.apiUrl.customerPortal.updatePolicyInfo}/${this.currentPolicyId}`, this.policyInfoForm.value).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          this.showInfoModal = false;
          this.alertService.success(response.message);
          this.getCustomerDetails();
        } else {
          this.alertService.error(response.message);
        }
      }
    });
  }

  toggleEditInfoModal(obj: any) {
    this.showInfoModal = !this.showInfoModal;
    this.currentPolicyId = obj.policy_id;
    if (this.showInfoModal) {
      this.policyInfoForm.patchValue({
        firstName: obj.first_name,
        lastName: obj.last_name,
        emailId: obj.email,
        mobileNo: this.commonSvc.setUSFormatPhoneNumber(obj.mobile)
      });
      setTimeout(() => {
        this.formValidationSvc.forms();
      }, 250);
    }
  }

  closeInfoModal() {
    this.showInfoModal = false;
  }
}

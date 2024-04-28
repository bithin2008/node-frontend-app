import { Component, OnInit } from '@angular/core';

import { AlertService } from 'src/app/@core/services/alert.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/@core/services/shared.service';
import { FormControl, UntypedFormBuilder, FormGroup, Validators, FormArray, NgForm } from '@angular/forms';

import { ApiService } from 'src/app/@core/services/api.service';
import * as _ from "lodash";
import { FormValidationService } from 'src/app/@core/services/form-validation.service';
import { CommonService } from 'src/app/@core/services/common.service';
import { AppConfig } from 'src/app/@utils/const/app.config';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  password: string = '';
  strongPassword = false;
  submitted = false;
  submitteEditProfile = false;
  loading = false;
  fogotPassToken:any;
  oldPasswordType: boolean = false;
  newPasswordType: boolean = false;
  confirmPasswordType: boolean = false;
  maxDate:any
  constructor(
    private router: Router,
    private alertService: AlertService,
    private fb: UntypedFormBuilder,
    private apiSvc: ApiService,
    private sharedService: SharedService,
    private commonSvc: CommonService,
    private formValidationSvc: FormValidationService
  ) {
    this.commonSvc.setTitle('First Premier Home Warranty: Customer Portal- Change Password');
  }

  isEightDigitsValid: string = '';
  isLowercaseValid: string = '';
  isUppercaseValid: string = '';
  isNumberValid: string = '';
  isSpecialValid: string = '';
  isAllValid: string = '';
  changePasswordForm = this.fb.group({
    oldPassword: ['', [Validators.required, this.formValidationSvc.notEmpty]],
    newPassword: ['', [Validators.required, this.formValidationSvc.notEmpty, this.formValidationSvc.matchValidator('confirmPassword', true)]],
    confirmPassword: ['', [Validators.required, this.formValidationSvc.notEmpty, this.formValidationSvc.matchValidator('newPassword')]]
  });

  get f() { return this.changePasswordForm.controls; }
  ngAfterViewInit() {
    this.formValidationSvc.forms();
  }

  onSubmitChangePassword() {
    this.submitted = true;
    if (this.changePasswordForm.valid) {
      const postData ={
        old_password: this.changePasswordForm.value.oldPassword,
        new_password: this.changePasswordForm.value.newPassword
      }
      this.apiSvc.post(AppConfig.apiUrl.realtorPortal.changProfilePassword, postData).subscribe({
        next: (response: any) => {
          if (response.status == 1) {
            this.changePasswordForm.reset()
            this.alertService.success(response.message);
          } else{
            this.alertService.error(response.message);
          }
        },
        error: () => {
        //  this.loading = false;
        },
        complete: () => {
          this.submitted = false;
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
      this.formValidationSvc.validateAllFormFields(this.changePasswordForm);
    }

  }

  checkPassword() {
    this.password = this.f['newPassword'].value;
    this.isEightDigitsValid = this.password.length >= 8 ? 'Pass' : 'Fail';
    this.isLowercaseValid = /[a-z]/.test(this.password) ? 'Pass' : 'Fail';
    this.isUppercaseValid = /[A-Z]/.test(this.password) ? 'Pass' : 'Fail';
    this.isNumberValid = /[0-9]/.test(this.password) ? 'Pass' : 'Fail';
    this.isSpecialValid =  /[`~!@#$%^&*()_=+\-{}\[\]\\|;:'",.<>/?]/.test(this.password) ? 'Pass' : 'Fail';///[!@#$%^&*]/.test(this.password) ? 'Pass' : 'Fail';

    this.isAllValid =
      this.isEightDigitsValid === 'Pass' &&
      this.isLowercaseValid === 'Pass' &&
      this.isUppercaseValid === 'Pass' &&
      this.isNumberValid === 'Pass' &&
      this.isSpecialValid === 'Pass'
        ? 'Pass'
        : 'Fail';
  }
}

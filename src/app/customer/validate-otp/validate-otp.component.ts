import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, UntypedFormBuilder, FormGroup, Validators, FormArray, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CountdownComponent } from 'ngx-countdown';
import { AlertService } from 'src/app/@core/services/alert.service';
import { AuthService } from 'src/app/@core/services/auth.service';
import { CommonService } from 'src/app/@core/services/common.service';
import { FormValidationService } from 'src/app/@core/services/form-validation.service';
@Component({
  selector: 'app-validate-otp',
  templateUrl: './validate-otp.component.html',
  styleUrls: ['./validate-otp.component.scss']
})
export class ValidateOtpComponent {
  @ViewChild('cd') private countdown: any = CountdownComponent;

  submitted = false;
  loading = false;
  currentOTP: any = '';
  public isDisabledResendotp: boolean = true

  constructor(
    private commonSvc: CommonService,
    private fb: UntypedFormBuilder,
    private authSvc: AuthService,
    private alertSvc: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private formValidationSvc: FormValidationService

  ) {
    this.commonSvc.setTitle('OTP Validation');
  }



  ngOnInit(): void {
    if (this.authSvc.isLoggedIn()) {
      //  this.router.navigate(['/']);
    }
    const logout = this.route.snapshot.queryParamMap.get('logout');
    if (logout) {
      this.logout();
    }
  }

  onOtpChange(e: any) {
    //   console.log(e);
    this.currentOTP = e;
  }


  validateOTP() {    
    this.submitted = true;
    this.loading = true;
    let postData = { otp: this.currentOTP, otpKey: localStorage.getItem('customer_otp_key') };
    this.authSvc.validateOTP(postData).subscribe({
      next: (response: any) => {        
        if (response.status==1) {
          localStorage.setItem('customer_token', response.token);
          localStorage.removeItem('customer_otp_key');
          this.router.navigateByUrl('/customer-portal/dashboard');
        }
      },
      error: () => { this.loading = false; },
      complete: () => { this.loading = false; }
    });
  }
  resendOtp() {
    this.submitted = true;
    if (localStorage.getItem('customer_otp_key') ) {
      let postData = { otpKey: localStorage.getItem('customer_otp_key') };
      this.authSvc.resendloginOTP(postData).subscribe({
        next: (response: any) => {
         if ( response.status==1) {
          this.countdown.restart();
          this.isDisabledResendotp = true;      
          this.alertSvc.success(response.message)
         }else{
          this.alertSvc.error(response.message)
         }
        },
        error: () => {  },
        complete: () => {  }
      });
    }else{
      this.alertSvc.error(`Something went wrong`),
      this.router.navigateByUrl(`/customer-portal`)
    }
   
  }
  handleEvent(e: any) {
    if (e.action == 'done') {
      this.isDisabledResendotp = false;
    }
  }
  logout() {
    this.authSvc.logout();
  }
}

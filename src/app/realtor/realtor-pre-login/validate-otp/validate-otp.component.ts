import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, UntypedFormBuilder, FormGroup, Validators, FormArray, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CountdownComponent } from 'ngx-countdown';
import { AlertService } from 'src/app/@core/services/alert.service';
import { AuthService } from 'src/app/@core/services/auth.service';
import { CommonService } from 'src/app/@core/services/common.service';
import { FormValidationService } from 'src/app/@core/services/form-validation.service';
import { SharedService } from 'src/app/@core/services/shared.service';
import { HttpErrorResponse } from '@angular/common/http';
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
    private shrdSvc: SharedService,
    private formValidationSvc: FormValidationService

  ) {
    this.commonSvc.setTitle('OTP Validation');
  }



  ngOnInit(): void {
    if (this.authSvc.isRealtorLoggedIn()) {
      //  this.router.navigate(['/']);
    }
    const logout = this.route.snapshot.queryParamMap.get('logout');
    if (logout) {
      this.logout();
    }
  }

  async ngAfterViewInit() {
    if(localStorage.getItem('realtor_token')){
      let validateRealtor: any = await this.validateRealtorAuth();
    }  
  }

  onOtpChange(e: any) {
    //   console.log(e);
    this.currentOTP = e;
  }


  validateOTP() {    
    localStorage.removeItem('token');
    localStorage.removeItem('customer_token');
    this.submitted = true;
    this.loading = true;
    let postData = { otp: this.currentOTP, otpKey: localStorage.getItem('realtor_otp_key') };
    this.authSvc.validateRealtorOTP(postData).subscribe({
      next: (response: any) => {        
        if (response.status==1) {
          localStorage.setItem('realtor_token', response.token);
          localStorage.removeItem('realtor_otp_key');
         
          this.router.navigateByUrl('/realestate-professional-portal/dashboard');
        }
      },
      error: () => { this.loading = false; },
      complete: () => { this.loading = false; }
    });
  }
  resendOtp() {
    this.submitted = true;
    if (localStorage.getItem('realtor_otp_key') ) {
      let postData = { otpKey: localStorage.getItem('realtor_otp_key') };
      this.authSvc.resendRealtorLoginOTP(postData).subscribe({
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
      this.router.navigateByUrl(`/realestate-professional-portal`)
    }
   
  }
  handleEvent(e: any) {
    if (e.action == 'done') {
      this.isDisabledResendotp = false;
    }
  }
  logout() {
    this.authSvc.realtorLogout();
  }

  validateRealtorAuth() {
    return new Promise((resolve, reject) => {
      this.authSvc.validateRealtorToken().subscribe({
        next: (response: any) => {     
          if (response.status == 1) {             
            this.shrdSvc.updateRealtorData(response);
            this.router.navigate(['/realestate-professional-portal/dashboard'])
          } 
        }, error: (err: HttpErrorResponse) => {
          console.log(err.error.message);
          this.router.navigate(['/realestate-professional-portal'])
        },
        complete: () => { }
      });
    })
  }
}

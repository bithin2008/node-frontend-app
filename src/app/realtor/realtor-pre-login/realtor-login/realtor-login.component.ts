import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, UntypedFormBuilder, FormGroup, Validators, FormArray, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/@core/services/auth.service';
import { AlertService } from 'src/app/@core/services/alert.service';
import { FormValidationService } from 'src/app/@core/services/form-validation.service';
import { CommonService } from 'src/app/@core/services/common.service';
import { SharedService } from 'src/app/@core/services/shared.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Meta, Title } from '@angular/platform-browser';
@Component({
  selector: 'app-realtor-login',
  templateUrl: './realtor-login.component.html',
  styleUrls: ['./realtor-login.component.scss'],
  providers: [AuthService, FormValidationService]
})
export class RealtorLoginComponent {
  @ViewChild('realtorEmail') realtorEmail!: ElementRef;
  @ViewChild('realtorPass') realtorPass!: ElementRef;
  submitted = false;
  loading = false;
  passwordType: boolean = false;
  public pageDetails:any={};
  constructor(
    private commonSvc: CommonService,
    private fb: UntypedFormBuilder,
    private authSvc: AuthService,
    private alertSvc: AlertService,
    private activatedRoute: ActivatedRoute,
    private shrdSvc: SharedService,
    private renderer: Renderer2,
    private router: Router,
    private authService: AuthService,
    private formValidationSvc: FormValidationService,
    private sharedService: SharedService,
    private title: Title, private meta: Meta
  ) {
    const resolvedData = this.activatedRoute.snapshot.data['routeData'];
    if (resolvedData?.data) {
      this.pageDetails = resolvedData.data
      this.title.setTitle(this.pageDetails?.title?this.pageDetails?.title:'First Premier Home Warranty:Real Estate Professional Login');
      this.meta.removeTag('keyword');
      this.meta.removeTag('description');
      this.meta.updateTag({ name: 'description', content: this.pageDetails?.meta_description?this.pageDetails?.meta_description:'' });
      this.meta.updateTag({ name: 'keywords', content: this.pageDetails?.meta_keywords?this.pageDetails?.meta_keywords:'' });
      this.meta.updateTag({ name: 'script', type: 'application/ld+json', content: this.pageDetails.schema_markup? JSON.stringify(this.pageDetails?.schema_markup):'' });
    }
  }
  loginForm = this.fb.group({
    email: ['', [Validators.required, this.formValidationSvc.notEmpty, this.formValidationSvc.validEmail]],
    password: ['', [Validators.required, this.formValidationSvc.notEmpty]],
  })

  get f() { return this.loginForm.controls; }

  onSubmit() {
    let responseResult = false;
    this.submitted = true;
    this.loading = true;
    if (this.loginForm.valid) {
      this.loginForm.value.email= this.loginForm.value.email.toLowerCase();
      const postData = this.loginForm.value;
      this.authSvc.realtorAuthenticate(postData).subscribe({
        next: (response: any) => {
          console.log(response);
          responseResult = response;
          if (response.status == 1) {
            this.router.navigate(['/realestate-professional-portal/validate-otp'], {
              queryParams: {
                key: response.otpkey
              },
              queryParamsHandling: 'merge',
            });
          } else if (response.status == 2) {
            localStorage.removeItem('realtor_otp_key');
            localStorage.removeItem('realtor_token');
            this.router.navigateByUrl('/realtor-portal');
          } else {
            this.alertSvc.warning(response.message)
          }
        },
        error: () => { this.loading = false; },
        complete: () => {
          this.loading = false; 
          if (!responseResult) {
            localStorage.removeItem('realtor_otp_key');
            localStorage.removeItem('realtor_token');
            this.router.navigateByUrl('/realestate-professional-portal');
          }
        }
      });

    } else {
      this.loading = false;
      this.formValidationSvc.validateAllFormFields(this.loginForm);
    }
  }

  async ngAfterViewInit() {
    localStorage.removeItem('token');
    localStorage.removeItem('customer_token');
    this.formValidationSvc.forms();
    if(localStorage.getItem('realtor_token')){
      let validateRealtor: any = await this.validateRealtorAuth();
    }  

    setTimeout(() => {
      this.sharedService.sharedPageData$.subscribe((response: any) => {
        if (response) {
          this.pageDetails = response.data;
          if(this.pageDetails){
            this.title.setTitle(this.pageDetails?.title);
            this.meta.removeTag('keyword');
            this.meta.removeTag('description');
            this.meta.updateTag({ name: 'description', content: this.pageDetails?.meta_description });
            this.meta.updateTag({ name: 'keywords', content: this.pageDetails?.meta_keywords });  
            this.meta.updateTag({ name: 'script', type: 'application/ld+json', content: JSON.stringify(this.pageDetails?.schema_markup) });      
          }       
        }
      })
    }, 1000);
  }


  validateRealtorAuth() {
    return new Promise((resolve, reject) => {
      this.authService.validateRealtorToken().subscribe({
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

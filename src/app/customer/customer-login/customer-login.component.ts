import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, UntypedFormBuilder, FormGroup, Validators, FormArray, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/@core/services/auth.service';
import { AlertService } from 'src/app/@core/services/alert.service';
import { FormValidationService } from 'src/app/@core/services/form-validation.service';
import { CommonService } from 'src/app/@core/services/common.service';
import { SharedService } from 'src/app/@core/services/shared.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-customer-login',
  templateUrl: './customer-login.component.html',
  styleUrls: ['./customer-login.component.scss'],
  providers: [AuthService, FormValidationService]
})
export class CustomerLoginComponent {
  @ViewChild('customerEmail') customerEmail!: ElementRef;
  @ViewChild('customerPass') customerPass!: ElementRef;
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
    private renderer: Renderer2,
    private formValidationSvc: FormValidationService,
    private sharedService: SharedService,
    private router: Router,
    private title: Title, private meta: Meta
  ) {
    const resolvedData = this.activatedRoute.snapshot.data['routeData'];
    if (resolvedData?.data) {
      this.pageDetails = resolvedData.data
      this.title.setTitle(this.pageDetails?.title?this.pageDetails?.title:'First Premier Home Warranty:Customer Portal Login');
      this.meta.removeTag('keyword');
      this.meta.removeTag('description');
      this.meta.updateTag({ name: 'description', content: this.pageDetails?.meta_description?this.pageDetails?.meta_description:'' });
      this.meta.updateTag({ name: 'keywords', content: this.pageDetails?.meta_keywords?this.pageDetails?.meta_keywords:'' });
      this.meta.updateTag({ name: 'script', type: 'application/ld+json', content: this.pageDetails.schema_markup? JSON.stringify(this.pageDetails?.schema_markup):'' });
    }
  }
  loginForm = this.fb.group({
    email: ['', [Validators.required, this.formValidationSvc.notEmpty,this.formValidationSvc.validEmail]],
    password: ['', [Validators.required, this.formValidationSvc.notEmpty]],
  })
  
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    if (this.loginForm.valid) {
      this.loginForm.value.email= this.loginForm.value.email.toLowerCase();
      const postData = this.loginForm.value;      
      this.authSvc.authenticate(postData).subscribe({
        next: (response: any) => {
          this.loading = false;
          if (response.status == 1) {
            this.router.navigate(['/customer/validate-otp']);
          } else if(response.status == 2){
            localStorage.setItem('token', response.token);
           // localStorage.removeItem('customer_otp_key');
            localStorage.removeItem('customer_token');
            this.router.navigateByUrl('/customer-portal');
          } else {
            this.alertSvc.warning(response.message)
          }
        },
        error: () => { this.loading = false; },
        complete: () => { this.loading = false; }
      });

    } else {
      this.loading = false;
      this.formValidationSvc.validateAllFormFields(this.loginForm);
    }
  }
  
  ngAfterViewInit() {
    this.formValidationSvc.forms();


  }

}

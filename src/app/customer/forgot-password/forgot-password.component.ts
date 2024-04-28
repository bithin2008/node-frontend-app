import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, FormGroup, Validators, FormArray, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/@core/services/auth.service';
import { AlertService } from 'src/app/@core/services/alert.service';
import { FormValidationService } from 'src/app/@core/services/form-validation.service';
import { CommonService } from 'src/app/@core/services/common.service';
import { ApiService } from 'src/app/@core/services/api.service';
import { AppConfig } from 'src/app/@utils/const/app.config';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  submitted = false;
  loading = false;
  passwordType: boolean = false;
  public pageDetails: any = {};
  constructor(
    private commonSvc: CommonService,
    private fb: UntypedFormBuilder,
    private apiSvc: ApiService,
    private alertSvc: AlertService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formValidationSvc: FormValidationService,
    private title: Title, private meta: Meta
  ) {
    this.commonSvc.setTitle('Customer Portal: Forgot Password');
    const resolvedData = this.activatedRoute.snapshot.data['routeData'];
    if (resolvedData?.data) {
      this.pageDetails = resolvedData.data
      this.title.setTitle(this.pageDetails?.title?this.pageDetails?.title:'First Premier Home Warranty:Customer Portal: Forgot Password');
      this.meta.removeTag('keyword');
      this.meta.removeTag('description');
      this.meta.updateTag({ name: 'description', content: this.pageDetails?.meta_description?this.pageDetails?.meta_description:'' });
      this.meta.updateTag({ name: 'keywords', content: this.pageDetails?.meta_keywords?this.pageDetails?.meta_keywords:'' });
      this.meta.updateTag({ name: 'script', type: 'application/ld+json', content: this.pageDetails.schema_markup? JSON.stringify(this.pageDetails?.schema_markup):'' });
    }
  } 

  fpForm = this.fb.group({
    email: ['', [Validators.required, this.formValidationSvc.notEmpty,this.formValidationSvc.validEmail]]
  })

  get f() { return this.fpForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    if (this.fpForm.valid) {
      const postData = this.fpForm.value;
      this.apiSvc.post(AppConfig.apiUrl.customerPortal.forgotPasswordLink, postData).subscribe({
        next: (response: any) => {
          if (response.status == 1) {
            this.alertSvc.success(response.message);            
          } else{
            this.alertSvc.error(response.message);
          }
        },
        error: () => {
          this.loading = false;
        },
        complete: () => {
          this.submitted = false;
          this.fpForm.reset()
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
      this.formValidationSvc.validateAllFormFields(this.fpForm);
    }
  }
  
  ngAfterViewInit() {
    this.formValidationSvc.forms();
  }
}

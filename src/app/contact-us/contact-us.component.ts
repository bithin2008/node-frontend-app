import { Component } from '@angular/core';
import { FormValidationService } from '../@core/services/form-validation.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../@core/services/alert.service';
import { ApiService } from '../@core/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig } from 'src/app/@utils/const/app.config';
import { CommonService } from '../@core/services/common.service';
import { SharedService } from '../@core/services/shared.service';
import { Meta, Title } from '@angular/platform-browser';
import { ReCaptchaV3Service } from 'ng-recaptcha';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent {
  public contactForm!: FormGroup;
  public contactFormSubmitted: boolean = false;
  public uploadedResume: any = '';
  public pageDetails: any = {};
  constructor(
    private fb: FormBuilder,
    private recaptchaV3Service: ReCaptchaV3Service,
    private alertService: AlertService,
    private formValidationService: FormValidationService,
    private apiService: ApiService,
    private router: Router,
     private activatedRoute: ActivatedRoute,
    private commonSvc: CommonService,
    private sharedService: SharedService,
    private title: Title, private meta: Meta
  ) {
    const resolvedData = this.activatedRoute.snapshot.data['routeData'];
    if (resolvedData?.data) {
      this.pageDetails = resolvedData.data
      this.title.setTitle(this.pageDetails?.title);
      this.meta.removeTag('keyword');
      this.meta.removeTag('description');
      this.meta.updateTag({ name: 'description', content: this.pageDetails?.meta_description ? this.pageDetails?.meta_description : '' });
      this.meta.updateTag({ name: 'keywords', content: this.pageDetails?.meta_keywords ? this.pageDetails?.meta_keywords : '' });
      this.meta.updateTag({ name: 'script', type: 'application/ld+json', content: this.pageDetails.schema_markup ? JSON.stringify(this.pageDetails?.schema_markup) : '' });
    }
 
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required, this.formValidationService.notEmpty]],
      lastName: ['', [Validators.required, this.formValidationService.notEmpty]],
      emailId: ['', [Validators.required, this.formValidationService.notEmpty, this.formValidationService.validEmail]],
      mobileNo: ['', [Validators.required, this.formValidationService.phoneNumberUS,]],
      message: ['', [Validators.required]],
    });
  }

  get s1() { return this.contactForm.controls; }

  ngAfterViewInit() {
    this.formValidationService.forms();

    // this.commonSvc.gsapInit();
    // this.commonSvc.gsapTxtRevealAnim();
    // this.commonSvc.gsapImgRevealAnim();

   
  }

  preventNumberInput(e: any) {
    var keyCode = (e.keyCode ? e.keyCode : e.which);
    if (keyCode > 47 && keyCode < 58 || keyCode > 95 && keyCode < 107) {
      e.preventDefault();
    }
  }

  mszKeyDown(e: any): any {
    if (e.which === 32 && !e.target.value.length) {
      e.preventDefault();
    }
  }

  changeMobileFormat(e: any) {
    this.contactForm.controls['mobileNo'].setValue(this.commonSvc.setUSFormatPhoneNumber(e.target.value.toString()));
  }

  async contactSubmit() {
    if (!this.contactForm.valid) {
      this.formValidationService.validateAllFormFields(this.contactForm);
      return
    }
    console.log('this.contactForm.value', this.contactForm.value);
    const token = await this.recaptchaV3Service.execute('submitContact').toPromise();
    let res: any = await this.commonSvc.verifyreCaptcha(token);
    if (res.status == 1) {
      this.apiService.post(`${AppConfig.apiUrl.contacts.submitContact}`, this.contactForm.value).subscribe({
        next: (response: any) => {
          console.log('response', response);
          if (response.status == 1) {
            this.contactForm.reset();
            this.router.navigate(['/contact-us/thank-you']);
          } else {
            this.alertService.error(response.message);
          }
        }
      });
    }
  }
}

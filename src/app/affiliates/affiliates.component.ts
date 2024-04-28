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
declare var Swiper: any;


@Component({
  selector: 'app-affiliates',
  templateUrl: './affiliates.component.html',
  styleUrls: ['./affiliates.component.scss']
})
export class AffiliatesComponent {
  public affiliateForm!: FormGroup;
  public affiliateFormSubmitted: boolean = false;
  public pageDetails:any={};
  public loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private formValidationService: FormValidationService,
    private apiService: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commonSvc: CommonService,
    private sharedService: SharedService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private title: Title, 
    private meta: Meta
  ) {
    const resolvedData = this.activatedRoute.snapshot.data['routeData'];
    if (resolvedData?.data) {
      this.pageDetails = resolvedData.data
      this.title.setTitle(this.pageDetails?.title);
      this.meta.removeTag('keyword');
      this.meta.removeTag('description');
      this.meta.updateTag({ name: 'description', content: this.pageDetails?.meta_description?this.pageDetails?.meta_description:'' });
      this.meta.updateTag({ name: 'keywords', content: this.pageDetails?.meta_keywords?this.pageDetails?.meta_keywords:'' });
      this.meta.updateTag({ name: 'script', type: 'application/ld+json', content: this.pageDetails.schema_markup? JSON.stringify(this.pageDetails?.schema_markup):'' });
    }
    this.affiliateForm = this.fb.group({
      firstName: ['', [Validators.required, this.formValidationService.notEmpty]],
      lastName: ['', [Validators.required, this.formValidationService.notEmpty]],
      emailId: ['', [Validators.required, this.formValidationService.notEmpty, this.formValidationService.validEmail]],
      mobileNo: ['', [Validators.required, this.formValidationService.phoneNumberUS,]],
      companyName: ['', [Validators.required, this.formValidationService.notEmpty]],
      message: ['', [Validators.required]],
    });
  }
  ngAfterViewInit() {
    new Swiper('.swiper__featuredon', {
      spaceBetween: 20,
      loop: false,

      // delay between transitions in ms
      autoplay: 4000,
      autoplayStopOnLast: false, // loop false also
      // If we need pagination
      // pagination: '.swiper-pagination',
      // paginationType: "bullets",

      // // Navigation arrows

      nextButton: '.swiper__featuredon--next',
      prevButton: '.swiper__featuredon--prev',
      //
      slidesPerView: 5,
      //
      //
      //
      // grabCursor: true,
      breakpoints: {
        1600: {
          slidesPerView: 4,
          spaceBetween: 30
        },
        1199: {
          slidesPerView: 2.5,
          spaceBetween: 30
        },
        575: {
          slidesPerView: 1.8,
          spaceBetween: 10
        }
      }
    });
    this.formValidationService.forms();
    // this.commonSvc.gsapInit();
    // this.commonSvc.gsapTxtRevealAnim();
    // this.commonSvc.gsapImgRevealAnim();
    // this.commonSvc.gsapBatchAnim('b2t');
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


  get s1() { return this.affiliateForm.controls; }

  changeMobileFormat(e: any) {
    this.affiliateForm.controls['mobileNo'].setValue(this.commonSvc.setUSFormatPhoneNumber(e.target.value.toString()));
  }

  async contactSubmit() {
    if (!this.affiliateForm.valid) {
      this.formValidationService.validateAllFormFields(this.affiliateForm);
      return
    }
    this.loading=true;
    const token = await this.recaptchaV3Service.execute('submitAffiliates').toPromise();
    let res: any = await this.commonSvc.verifyreCaptcha(token);
    if (res.status == 1) {

    this.apiService.post(`${AppConfig.apiUrl.affiliates.submitAffiliate}`, this.affiliateForm.value).subscribe({
      next: (response: any) => {
        console.log('response', response);
        this.loading=false;
        if (response.status == 1) {         
        //  this.alertService.success(response.message);
          this.affiliateFormSubmitted = false;
          this.affiliateForm.reset();
          this.router.navigate(['/affiliates/thank-you']);
        } else {
          this.alertService.error(response.message);
        }
      },
      error: (er) => {
        this.loading = false;
      },
      complete: () => {        
        this.loading = false;
      }
    });
  }
  }
}

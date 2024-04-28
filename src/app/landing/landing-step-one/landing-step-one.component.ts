import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/@core/services/alert.service';
import { ApiService } from 'src/app/@core/services/api.service';
import { CommonService } from 'src/app/@core/services/common.service';
import { FormValidationService } from 'src/app/@core/services/form-validation.service';
import { UtilityService } from 'src/app/@core/services/utility.service';
import * as moment from 'moment';
import { AppConfig } from 'src/app/@utils/const/app.config';
import { SharedService } from 'src/app/@core/services/shared.service';
import { Meta, Title } from '@angular/platform-browser';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { HttpClient } from '@angular/common/http';
import { environment } from "@env/environment";
declare var Swiper: any;
declare var gsap: any;
declare var ScrollTrigger: any;
declare var EF: any;
@Component({
  selector: 'app-landing-step-one',
  templateUrl: './landing-step-one.component.html',
  styleUrls: ['./landing-step-one.component.scss']
})
export class LandingStepOneComponent {
  public landingStepOneForm!: FormGroup;
  public landingStepTwoForm!: FormGroup;
  public landingStepThreeForm!: FormGroup;
  public validZipMessage: any = '';
  public validZip: boolean = false;
  public landingStepOneFormSubmitted: boolean = false;
  public landingStepTwoFormSubmitted: boolean = false;
  public selectedCity: any = '';
  public selectedState: any = '';
  public currectYear: any = '';
  public showArrow: boolean = false;
  public marketLeadersList: any = [];
  public pageDetails: any = {};
  public loading: boolean = false;
  public ziploading: boolean = false;

  public offerId: any = '';
  public utmId: any = '';
  public clickId: any = '';
  public leadSource: any = '';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private apiService: ApiService,
    private commonSvc: CommonService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private formValidationService: FormValidationService,
    private utilityService: UtilityService,
    private sharedService: SharedService,
    private title: Title, private meta: Meta,
    private http: HttpClient

  ) {
    this.commonSvc.setTitle('First Premier Home Warranty: Home');
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
    this.landingStepOneForm = this.fb.group({
      zipCode: ['', [Validators.required, this.formValidationService.notEmpty]]
    });

    this.landingStepTwoForm = this.fb.group({
      firstName: ['', [Validators.required, this.formValidationService.notEmpty]],
      lastName: ['', [Validators.required, this.formValidationService.notEmpty]]
    });

    this.landingStepThreeForm = this.fb.group({
      emailId: ['', [Validators.required, this.formValidationService.notEmpty, this.formValidationService.validEmail]],
      mobileNo: ['', [Validators.required, this.formValidationService.phoneNumberUS,]]
    });

    this.currectYear = moment().format('YYYY');

    this.activatedRoute.queryParams.subscribe((params: any) => {
      // console.log(1, params['utm_medium']);
      // console.log(2, params['utm_source']);
      // console.log(3, params['oclickid']);
      // console.log(4, params['utm_campaign']);
      // console.log(5, params['lead-s']);
      this.offerId = params['ocode'] ? params['ocode'] : ''
      let utmMedium = params['utm_medium'] ? `utm_medium=${params['utm_medium']}` : '';
      let utmSource = params['utm_source'] ? `utm_source=${params['utm_source']}` : '';
      let utmCampaign = params['utm_campaign'] ? `utm_campaign=${params['utm_campaign']}` : '';
      this.utmId = (utmMedium != '' ? utmMedium : '') + (utmSource != '' ? '&' + utmSource : '') + (utmCampaign != '' ? '&' + utmCampaign : '');
      this.clickId = params['oclickid'];
      this.leadSource = params['lead-s'];


    });

    setTimeout(() => {
      if (typeof EF !== 'undefined') {
        EF.click({
          offer_id: EF.urlParameter('oid'),
          affiliate_id: EF.urlParameter('affid'),
          sub1: EF.urlParameter('sub1'),
          sub2: EF.urlParameter('sub2'),
          sub3: EF.urlParameter('sub3'),
          sub4: EF.urlParameter('sub4'),
          sub5: EF.urlParameter('sub5'),
          uid: EF.urlParameter('uid'),
          source_id: EF.urlParameter('source_id'),
          transaction_id: EF.urlParameter('_ef_transaction_id'),
        });
      }
    }, 700);




    setTimeout(() => {
      this.formValidationService.forms();
    }, 250);
  }
  ngAfterViewInit() {
    ScrollTrigger.refresh();
    // gsap.set(".card--featuredOn", { autoAlpha: 0, y: 10 });
    // gsap.to(".card--featuredOn", {
    //   scrollTrigger: ({
    //     trigger: ".leader_wrapper",
    //     start: "bottom bottom",
    //   }),
    //   autoAlpha: 1,
    //   y: 0,
    //   stagger: 0.1,
    // });

    // -------------------------------

    // gsap.set(".work_item", { autoAlpha: 0, x: 10 });
    // gsap.to(".work_item", {
    //   scrollTrigger: ({
    //     trigger: ".work_flow",
    //     start: "bottom bottom",
    //   }),
    //   autoAlpha: 1,
    //   x: 0,
    //   stagger: 0.1,
    // });

    // -------------------------------

    // gsap.set(".fp__protection .protection_wrapper .float-img", { autoAlpha: 0, y: 50 });
    // gsap.to(".fp__protection .protection_wrapper .float-img", {
    //   scrollTrigger: ({
    //     trigger: ".fp__protection",
    //     start: "center center",
    //   }),
    //   autoAlpha: 1,
    //   y: 0,
    // });


    // -------------------------------
    if (this.isNewSession()) {
      console.log("This is a new session.");
      sessionStorage.setItem("sessionStarted", "true");
      let session = this.generateSessionId();
      localStorage.setItem('session_id', session);
    } else {
      console.log("This is an existing session.");
    }
    if (localStorage.getItem('step') == 'step-1') {
      this.getLeadDetailsByEmailAndSessionId();
    }



  }

  @HostListener('window:scroll', ['$event']) onScroll($event: Event): void {
    if ($event) {
      if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
      ) {
        this.showArrow = true;
      } else {
        this.showArrow = false;
      }
    }
  }

  isNewSession() {
    return sessionStorage.getItem("sessionStarted") !== "true";
  }

  generateSessionId() {
    sessionStorage.setItem("SessionName", "LandingSessionData");
    return Math.random().toString(36).substr(2, 20); // Generate a random alphanumeric string
  }

  public customerReviews: any = [];

  get s1() { return this.landingStepOneForm.controls; }
  get s2() { return this.landingStepTwoForm.controls; }
  get s3() { return this.landingStepThreeForm.controls; }

  getLeadDetailsByEmailAndSessionId() {
    let data = {
      sessionId: localStorage.getItem('session_id'),
      emailId: localStorage.getItem('email'),
      mobileNo: localStorage.getItem('mobile'),
    }
    this.apiService.post(AppConfig.apiUrl.lead.getLeadDetailsByEmailAndSessionId, data).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          this.validZip = true;
          this.landingStepOneForm.patchValue({
            zipCode: response.data.property_zip,
          });
          this.landingStepTwoForm.patchValue({
            firstName: response.data.first_name,
            lastName: response.data.last_name
          });
          this.landingStepThreeForm.patchValue({
            mobileNo: this.commonSvc.setUSFormatPhoneNumber(response.data.mobile),
            emailId: response.data.email
          });
        } else {
          this.alertService.error(response.message);
        }
      }
    });
  }

  getAllMarketLeaders() {
    this.apiService.get(`${AppConfig.apiUrl.common.getAllMarketLeaders}?active_status=1`).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          this.marketLeadersList = response.data;
          setTimeout(() => {
            new Swiper('.swiper__leader', {
              spaceBetween: 10,
              slidesPerView: 2,
              slidesPerColumn: 2,
              slidesPerGroup: 2,
              // gridRows:2,
              loop: false,
              autoplay: 500,
              speed: 1000,
              paginationType: 'bullets',
              pagination: '.swiper-pagination',
              paginationClickable: true,
            });
          }, 5000);
        } else {
          this.alertService.error(response.message);
        }
      }
    });
  }

  getCustomerReviews() {
    this.apiService.post(`${AppConfig.apiUrl.common.getAllReviews}?active_status=1&page=1&limit=10&sortField=rating&sortOrder=DESC`, {}).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          this.customerReviews = response.data;
          this.commonSvc.gsapBatchAnim('b2t');
          setTimeout(() => {
            new Swiper('.swiper__testimonials', {
              slidesPerView: 4,
              spaceBetween: 20,
              loop: false,
              autoplay: 2000,
              nextButton: '.swiper__testimonials--next',
              prevButton: '.swiper__testimonials--prev',

              breakpoints: {
                1900: {
                  slidesPerView: 3,
                },
                767: {
                  slidesPerView: 2,
                  spaceBetween: 10,
                },
                480: {
                  slidesPerView: 1.25,
                  spaceBetween: 10,
                },
              }
            });
          }, 400);
        } else {
          this.alertService.error(response.message);
        }
      }
    });
  }

  ngOnInit() {
    this.getCustomerReviews();
    this.getAllMarketLeaders()
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1000);


    setTimeout(() => {
      ScrollTrigger.refresh();

      // gsap.set(".card--featuredOn", {autoAlpha: 0, y: 10});
      // gsap.to(".card--featuredOn", {
      //   scrollTrigger: ({
      //     trigger: ".leader_wrapper",
      //     start: "bottom bottom",
      //   }),
      //   autoAlpha: 1,
      //   y: 0,
      //   stagger: 0.1, 
      // });        
    }, 2000);
    this.commonSvc.gsapTxtRevealAnim();
    this.commonSvc.gsapBatchAnim('b2t');
  }

  nextStep(step: any) {
    let prevStep = `step${step - 1}`
    let currentStep = `step${step}`
    let stepEl = document.getElementById(currentStep);
    let prevStepEl = document.getElementById(prevStep);

    // console.log(stepEl);
    let formStyle: any = document.getElementsByClassName('form-style-3')
    if (formStyle && formStyle.length > 0) {
      let formArray = Array.from(formStyle);

      formArray.forEach((element: any) => {
        console.log(element);

        element.classList.remove('active')
      });
    }
    if (prevStepEl) {
      prevStepEl.classList.add("complete");
    }
    if (stepEl) {
      stepEl.classList.add("active");
      let getP = stepEl.parentElement as HTMLElement;
      getP.style.height = `${stepEl.offsetHeight}px`;
    }
  }

  changePhoneFormat(e: any) {
    this.landingStepThreeForm.controls['mobileNo'].setValue(this.commonSvc.setUSFormatPhoneNumber(e.target.value.toString()));
  }

  onInputChange(event: any) {
    let inputValue: any = event.target.value;
    inputValue = inputValue.replace(/[^0-9]/g, '');
    inputValue = inputValue.slice(0, 5);
    this.landingStepOneForm.patchValue({
      zipCode: inputValue
    });
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

  chekcZipCode(ev: any) {
    if (ev.target.value.length > 4) {
      this.validZipMessage = '';
      this.validZip = false;
      this.selectedState = '';
      this.selectedCity = '';
      this.ziploading = true;
      this.apiService.post(AppConfig.apiUrl.common.locationByZip, { zip: ev.target.value.toString() }).subscribe({
        next: (response: any) => {
          this.ziploading = false;
          if (response.status == 1) {
            if (response.data.is_serviceable == 1 && response.data.active_status == 1) {
              this.validZip = true;
              this.selectedState = response.data.state;
              this.selectedCity = response.data.city;
            } else {

              this.validZipMessage = 'Unavailable services in this zip code';
            }
          } else {
            this.validZipMessage = response.message;
          }
        },
        error: () => { this.ziploading = false; },
        complete: () => { this.ziploading = false; }
      });
    } else {
      this.validZipMessage = '';
    }
  }

  landingStepOneFormSubmit(stepNum: number) {
    if (!this.landingStepOneForm.valid) {
      this.formValidationService.validateAllFormFields(this.landingStepOneForm);
      return
    }
    if (!this.validZip) {
      return
    }
    this.nextStep(stepNum)
  }

  landingStepTwoFormSubmit(stepNum: number) {
    if (!this.landingStepTwoForm.valid) {
      this.formValidationService.validateAllFormFields(this.landingStepTwoForm);
      return
    }
    this.nextStep(stepNum)
  }

  scrollToTop() {
    window.scroll({ top: 0, behavior: "smooth" })
  }




  async landingStepThreeFormSubmit(stepNum: number) {
    if (!this.landingStepThreeForm.valid) {
      this.formValidationService.validateAllFormFields(this.landingStepThreeForm);
      return
    }

    let postData: any = {
      session_id: localStorage.getItem('session_id'),
      mobileNo: this.commonSvc.convertToNormalPhoneNumber(this.s3['mobileNo'].value),
      firstName: this.s2['firstName'].value,
      lastName: this.s2['lastName'].value,
      emailAddress: this.s3['emailId'].value,
      zipCode: this.s1['zipCode'].value,
      state: this.selectedState,
      city: this.selectedCity,
      step: 1
    }
    let leadData = await this.updateLeadInVanillaSoft(postData);
    postData.lead_data = leadData
    this.loading = true;
    const token = await this.recaptchaV3Service.execute('submitStepFourFromFunnel').toPromise();
    let res: any = await this.commonSvc.verifyreCaptcha(token);
    if (res.status == 1) {

      this.apiService.post(`${AppConfig.apiUrl.lead.createUpdateLead}`, postData).subscribe({
        next: (response: any) => {
          this.loading = false;
          if (response.status == 1) {
            if (typeof EF !== 'undefined') {
              EF.conversion({
                offer_id: 1,
                email: this.s3['emailId'].value,
              });
            }
            localStorage.setItem('step', 'step-1');
            localStorage.setItem('lead_id', response.data.lead_id);
            localStorage.setItem('session_id', response.data.session_id);
            localStorage.setItem('lead_user_id', response.data.lead_user_id);
            localStorage.setItem('lead_obj', JSON.stringify(response.data.lead_data));
            localStorage.setItem('email', this.s3['emailId'].value),
              localStorage.setItem('mobile', this.s3['mobileNo'].value),
              this.router.navigate(['/home-warranty-quotes/step-two']);
          } else {
            this.loading = false;
            this.alertService.error(response.message);
          }
        }
      });
    } else {
      this.loading = false;
    }
  }
  async updateLeadInVanillaSoft(postData: any) {
    let leadData: any = {};
    if (postData['city']) {
      leadData['city'] = postData['city']
    }
    if (postData['state']) {
      leadData['state'] = postData['state']
    }
    if (postData['zipCode']) {
      leadData['zipcode'] = postData['zipCode']
    }
    if (postData['emailAddress']) {
      leadData['email'] = postData['emailAddress']
    }
    if (postData['firstName']) {
      leadData['first_name'] = postData['firstName']
    }
    if (postData['lastName']) {
      leadData['last_name'] = postData['lastName']
    }
    if (postData['mobileNo']) {
      leadData['mobile'] = postData['mobileNo']
    }
    leadData['UTMID'] = this.utmId ? this.utmId : '';
    leadData['lead_source'] = this.leadSource ? this.leadSource : 'Web Search';
    leadData['clickid'] = this.clickId ? this.clickId : '';
    // console.log('leadData', leadData);
    return leadData
  }
}

import { Component, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
import { Meta, Title } from '@angular/platform-browser';
import { FormValidationService } from '../@core/services/form-validation.service';
import { AlertService } from '../@core/services/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../@core/services/common.service';
import { ApiService } from '../@core/services/api.service';
import { AppConfig } from 'src/app/@utils/const/app.config';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from '../@core/services/utility.service';
import * as _ from "lodash";
import { SharedService } from '../@core/services/shared.service';
import { environment } from "@env/environment";
declare var Swiper: any;
declare var gsap: any;
declare var ScrollTrigger: any;
import { ReCaptchaV3Service } from 'ng-recaptcha';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public loading: boolean = false;
  public ziploading: boolean = false;
  public homeForm: FormGroup;
  public homeFormSubmitted: boolean = false;
  public validZip: boolean = false;
  public leadId: any = '';
  public isShowAllAddonItems: boolean = false;
  public addOnProductList: any = [];
  public formErrorMessage: any = '';
  public validZipMessage: any = '';
  public planList: any = [];
  public customerReviews: any = [];
  public planWiseProductList: any = [];
  public marketLeadersList: any = [];
  public pageDetails: any = {};
  public environment: any = environment;
  currentRoute: any = '';
  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private apiService: ApiService,
    private commonSvc: CommonService,
    private formValidationService: FormValidationService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private sharedService: SharedService,
    private utilityService: UtilityService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private title: Title, private meta: Meta
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
    this.homeForm = this.fb.group({
      zipCode: ['', [Validators.required, this.formValidationService.notEmpty]]
    });
  }

  ngOnInit() {
    let session = this.generateSessionId();
    if (this.isNewSession()) {
      console.log("This is a new session.");
      sessionStorage.setItem("sessionStarted", "true");
      localStorage.setItem('session_id', session);
    } else {
      console.log("This is an existing session.");
      if (localStorage.getItem('session_id') == null) {
        localStorage.setItem('session_id', session);
      }
    }
    this.currentRoute = this.router.url.substring(1);
  }


  getPageDetails() {
    this.apiService.get(`${AppConfig.apiUrl.common.getPageDetails}?route=${this.currentRoute ? this.currentRoute : 'home'}&active_status=1`).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          if (response.data) {
            this.pageDetails = response.data;
            this.title.setTitle(this.pageDetails?.title);
            this.meta.updateTag({ name: 'description', content: this.pageDetails?.meta_description });
            this.meta.updateTag({ name: 'keywords', content: this.pageDetails?.meta_keywords });
            this.meta.updateTag({ name: 'script', type: 'application/ld+json', content: JSON.stringify(this.pageDetails?.schema_markup) });
          }
        }
      }
    });
  }

  ngAfterViewInit() {
    this.getAllMarketLeaders();
    this.getAllPlans();
    this.getAllAddonProducts();
    this.utilityService.forms();
    this.utilityService.initTab();


    setTimeout(() => {
      ScrollTrigger.refresh();

      // arw animation
      let dpath: any = document.querySelector('#dpath');
      let dpathlength = dpath.getTotalLength();
      let dsvgtl = gsap.timeline({ ease: "power1.out" });

      dsvgtl.to(dpath, { strokeDasharray: dpathlength });
      dsvgtl.to('#darwpath', { x: '-10%', y: ' -15%' });

      dsvgtl.to('#dsvg', 0, { opacity: 1 });

      dsvgtl.fromTo(dpath, 1.5, { strokeDashoffset: dpathlength }, { strokeDashoffset: 0 });
      dsvgtl.to('#darwpath', 0.35, { opacity: 1, x: 0, y: 0 });



    }, 1000);


    // setTimeout(() => {
    //   ScrollTrigger.refresh();

    //   gsap.set(".card--featuredOn", {autoAlpha: 0, y: 10});
    //   gsap.to(".card--featuredOn", {
    //     scrollTrigger: ({
    //       trigger: ".leader_wrapper",
    //       start: "bottom bottom",
    //     }),
    //     autoAlpha: 1,
    //     y: 0,
    //     stagger: 0.1, 
    //   });

    //   // -------------------------------



    //   gsap.set(".work_item", { autoAlpha: 0, x: 10 });
    //   gsap.to(".work_item", {
    //     scrollTrigger: ({
    //       trigger: ".work_flow",
    //       start: "bottom bottom",
    //     }),
    //     autoAlpha: 1,
    //     x: 0,
    //     stagger: 0.1,
    //   });

    //   // -------------------------------

    //   gsap.set(".fp__protection .protection_wrapper .float-img", { autoAlpha: 0, y: 50 });
    //   gsap.to(".fp__protection .protection_wrapper .float-img", {
    //     scrollTrigger: ({
    //       trigger: ".fp__protection",
    //       start: "center center",
    //     }),
    //     autoAlpha: 1,
    //     y: 0,
    //   });


    //   // -------------------------------


    //   //  this.getPageDetails();

    // }, 2000);
    // this.formValidationService.forms();
    // this.commonSvc.gsapTxtRevealAnim();
    // this.commonSvc.gsapBatchAnim('b2t');
  }


  get s1() { return this.homeForm.controls; }

  isNewSession() {
    return sessionStorage.getItem("sessionStarted") !== "true";
  }

  generateSessionId() {
    sessionStorage.setItem("SessionName", "SessionData");
    return Math.random().toString(36).substr(2, 20); // Generate a random alphanumeric string
  }

  getAllPlans() {
    this.apiService.get(`${AppConfig.apiUrl.common.getAllPlans}?active_status=1`).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          response.data.forEach((element: any) => {
            if (element.plan_id == 2 || element.plan_id == 1) {
              this.planList.push(element)
            }
          });
          this.planList.forEach((element: any) => {
            if (element.plan_id == 2) {
              element.is_active = true;
            }
            element.product_list.forEach((item: any) => {
              item['plan_id'] = element.plan_id;
              let isExist;
              if (this.planWiseProductList.length > 0) {
                isExist = _.find(this.planWiseProductList, { 'product_id': item.product_id });
              }
              if (isExist) {
                this.planWiseProductList = _.reject(this.planWiseProductList, { 'product_id': item.product_id });
                item['exist_in_both_plan'] = true
              } else {
                item['exist_in_both_plan'] = false
              }
              this.planWiseProductList.push(item);

            });
          });
          //  this.planList = this.planList.reverse();
          this.planWiseProductList = _.unionBy(this.planWiseProductList, 'product_id');


          let filteredArray: any = _.filter(this.planWiseProductList, { 'exist_in_both_plan': false });

          filteredArray.forEach((item: any) => {
            this.planWiseProductList.forEach((obj: any, index: number) => {
              if (item.product_id == obj.product_id) {
                this.planWiseProductList.splice(index, 1);
                this.planWiseProductList.push(item);
              }
            });
          });
          // this.planWiseProductList = this.planWiseProductList.sort((a:any, b:any) => b.sequence - a.sequence);
          this.planWiseProductList = this.planWiseProductList.sort((a: any, b: any) => {
            if (a.sequence === null && b.sequence !== null) {
              return 1; // Move items with null sequence to the end
            } else if (a.sequence !== null && b.sequence === null) {
              return -1; // Move items with non-null sequence to the beginning
            } else {
              return a.sequence - b.sequence; // Regular sorting for non-null sequences
            }
          });


        } else {
          this.alertService.error(response.message);
        }
      }
    });
  }

  changePhoneFormat(e: any) {
    this.homeForm.controls['mobileNo'].setValue(this.commonSvc.setUSFormatPhoneNumber(e.target.value.toString()));
  }

  async homeFormSubmit() {
    this.formErrorMessage = '';
    this.homeFormSubmitted = true;
    if (!this.homeForm.valid) {
      this.formValidationService.validateAllFormFields(this.homeForm);
      return
    }
    if (!this.validZip) {
      return
    }
    let postData = this.homeForm.value;
    postData.session_id = localStorage.getItem('session_id');
    //postData.mobileNo = this.commonSvc.convertToNormalPhoneNumber(postData.mobileNo);
    postData.step = 1;
    this.loading = true;
    const token = await this.recaptchaV3Service.execute('verifyZipCodeFromHome').toPromise();
    let res: any = await this.commonSvc.verifyreCaptcha(token);
    if (res.status == 1) {
      this.apiService.post(`${AppConfig.apiUrl.lead.createUpdateLead}`, postData).subscribe({
        next: (response: any) => {
          console.log('response', response);
          if (response.status == 1) {
            this.loading = false;
            localStorage.setItem('step', 'step-1');
            // localStorage.setItem('email', response.data.email);
            // localStorage.setItem('mobile', response.data.mobile);
            localStorage.setItem('zip', this.homeForm.value.zipCode);
            this.router.navigate(['/checkout']);
          } else {
            this.formErrorMessage = response.message;
            this.loading = false;
            setTimeout(() => {
              this.formErrorMessage = '';
            }, 4500);
            // this.alertService.error(response.message);
          }
        },
        error: () => { this.loading = false; },
        complete: () => { this.loading = false; }
      });
    } else {
      this.loading = false;
    }
  }

  getAllAddonProducts() {
    this.apiService.get(`${AppConfig.apiUrl.common.getAllAddonProducts}?active_status=1`).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          this.addOnProductList = response.data;
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
              loop: false,
              autoplay: 500,
              speed: 1000,
              paginationType: 'bullets',
              pagination: '.swiper-pagination',
              paginationClickable: true,
            });
          }, 400);
        } else {
          this.alertService.error(response.message);
        }
      }
    });
  }

  chekcZipCode(ev: any) {
    if (ev.target.value.length > 4) {
      this.validZipMessage = '';
      this.validZip = false;
      this.ziploading = true;      
      this.apiService.post(AppConfig.apiUrl.common.locationByZip, { zip: ev.target.value.toString() }).subscribe({
        next: (response: any) => {
          this.ziploading = false;   
          if (response.status == 1) {
            if (response.data.is_serviceable == 1 && response.data.active_status == 1) {
              this.validZip = true;
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

  onInputChange(event: any) {
    let inputValue: any = event.target.value;
    inputValue = inputValue.replace(/[^0-9]/g, '');
    inputValue = inputValue.slice(0, 5);
    this.homeForm.patchValue({
      zipCode: inputValue
    });
  }

  toggleAddonItems() {
    this.isShowAllAddonItems = !this.isShowAllAddonItems;
  }

  onImgError(event: any) {
    event.target.src = 'assets/img/icon/adon-icon1.webp';
  }
}

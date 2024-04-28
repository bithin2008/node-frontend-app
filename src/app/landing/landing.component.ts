import { Component } from '@angular/core';
import { CommonService } from '../@core/services/common.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../@core/services/alert.service';
import { ApiService } from '../@core/services/api.service';
import { FormValidationService } from '../@core/services/form-validation.service';
import { UtilityService } from '../@core/services/utility.service';
import { AppConfig } from 'src/app/@utils/const/app.config';

declare var Swiper: any;
declare var gsap: any;
declare var ScrollTrigger: any;
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    private apiService: ApiService,
    private commonSvc: CommonService,
    private formValidationService: FormValidationService,
    private utilityService: UtilityService

  ) {
    this.commonSvc.setTitle('First Premier Home Warranty: Home');

  }
  ngAfterViewInit() {

      ScrollTrigger.refresh();

      gsap.set(".card--featuredOn", { autoAlpha: 0, y: 10 });
      gsap.to(".card--featuredOn", {
        scrollTrigger: ({
          trigger: ".leader_wrapper",
          start: "bottom bottom",
        }),
        autoAlpha: 1,
        y: 0,
        stagger: 0.1,
      });

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

      gsap.set(".fp__protection .protection_wrapper .float-img", { autoAlpha: 0, y: 50 });
      gsap.to(".fp__protection .protection_wrapper .float-img", {
        scrollTrigger: ({
          trigger: ".fp__protection",
          start: "center center",
        }),
        autoAlpha: 1,
        y: 0,
      });


      // -------------------------------


  }


  public customerReviews: any = [];


  getCustomerReviews() {
    this.apiService.post(`${AppConfig.apiUrl.common.getAllReviews}?active_status=1&page=1&limit=10&sortField=rating&sortOrder=DESC`,{}).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          this.customerReviews= response.data;  
          this.commonSvc.gsapBatchAnim('b2t');
          setTimeout(() => {
            new Swiper('.swiper__testimonials', {
              slidesPerView: 4,
              spaceBetween: 20, 
              loop: true,
              autoplay: 2000,
            
              nextButton: '.swiper__testimonials--next',
              prevButton: '.swiper__testimonials--prev',
              
              breakpoints: {
                1900: {
                  slidesPerView: 3,
                },
                1199: {
                  slidesPerView: 2,
                },
                990: {
                  slidesPerView: 2,
                  spaceBetween: 10,
                },
                767: {
                  slidesPerView: 1,
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
  //  this.getCustomerReviews();
  }




  nextStep(step:any){
    let prevStep = `step${step-1}`
    let currentStep = `step${step}`
    let stepEl= document.getElementById(currentStep);
    let prevStepEl= document.getElementById(prevStep);
    
   // console.log(stepEl);
    let formStyle:any = document.getElementsByClassName('form-style-3')
    if (formStyle && formStyle.length>0) {
      let formArray = Array.from(formStyle);

      formArray.forEach((element:any) => {
        console.log(element);

        element.classList.remove('active')
      });
    }
    if (prevStepEl) {
      prevStepEl.classList.add("complete");
    }
    if (stepEl) {
      console.log(stepEl);
      stepEl.classList.add("active");
      let getP =  stepEl.parentElement as HTMLElement;
      getP.style.height = `${stepEl.offsetHeight}px`;
    }
  

   }
}

import { Component, AfterViewInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { AppConfig } from 'src/app/@utils/const/app.config';
import { Router } from '@angular/router';
import { FormValidationService } from 'src/app/@core/services/form-validation.service';
import { AlertService } from 'src/app/@core/services/alert.service';
import { ApiService } from 'src/app/@core/services/api.service';
import { CommonService } from 'src/app/@core/services/common.service';
import { UtilityService } from 'src/app/@core/services/utility.service';
declare var Swiper: any;

@Component({
  selector: 'app-testimoial-slider',
  templateUrl: './testimoial-slider.component.html',
  styleUrls: ['./testimoial-slider.component.scss']
})
export class TestimoialSliderComponent {
  public customerReviews: any = [];
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
    this.getCustomerReviews();
  }

  getCustomerReviews() {
    this.apiService.post(`${AppConfig.apiUrl.common.getAllReviews}?active_status=1&page=1&limit=10&sortField=rating&sortOrder=DESC`,{}).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          this.customerReviews= response.data;  
          this.commonSvc.gsapBatchAnim('b2t');
          setTimeout(() => {
            new Swiper('.swiper__testimonials', {
              slidesPerView: 3.5,
              spaceBetween: 20, 
              loop: true,
              autoplay: 1000,
              nextButton: '.swiper__testimonials--next',
              prevButton: '.swiper__testimonials--prev',
              
              breakpoints: {
                1900: {
                  slidesPerView: 2.5,
                },
                1199: {
                  slidesPerView: 1.5,
                },
                990: {
                  slidesPerView: 2.5,
                  spaceBetween: 10,
                },
                767: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                  loop: false,
                  autoplay: 500,
                  speed: 1000,
                  grabCursor: true,
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
    this.commonSvc.gsapInit();
  }
}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormValidationService } from '../@core/services/form-validation.service';
import { ApiService } from '../@core/services/api.service';
import { LoaderService } from '../@core/services/loader.service';
import { AppConfig } from 'src/app/@utils/const/app.config';
import { AlertService } from '../@core/services/alert.service';
import { CdkStepper } from '@angular/cdk/stepper';
import { CommonService } from '../@core/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from "lodash";
import { SharedService } from '../@core/services/shared.service';
import { Meta, Title } from '@angular/platform-browser';
// declare var Swiper: any;
@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent {
  public customerReviews: any = [];
  public pageDetails: any = {};
  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private formValidationService: FormValidationService,
    private apiService: ApiService,

    private commonSvc: CommonService,
    private sharedService: SharedService,
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
      this.meta.updateTag({ name: 'description', content: this.pageDetails?.meta_description ? this.pageDetails?.meta_description : '' });
      this.meta.updateTag({ name: 'keywords', content: this.pageDetails?.meta_keywords ? this.pageDetails?.meta_keywords : '' });
      this.meta.updateTag({ name: 'script', type: 'application/ld+json', content: this.pageDetails.schema_markup ? JSON.stringify(this.pageDetails?.schema_markup) : '' });
    }
  }
  ngOnInit() {
    this.getCustomerReviews();
  }

  ngAfterViewInit() {
    // this.commonSvc.gsapInit();
    // this.commonSvc.gsapTxtRevealAnim();
    setTimeout(() => {
      this.sharedService.sharedPageData$.subscribe((response: any) => {
        if (response) {
          this.pageDetails = response.data;
          if (this.pageDetails) {
            this.title.setTitle(this.pageDetails?.title);
            this.meta.updateTag({ name: 'description', content: this.pageDetails?.meta_description });
            this.meta.updateTag({ name: 'keywords', content: this.pageDetails?.meta_keywords });
            this.meta.updateTag({ name: 'script', type: 'application/ld+json', content: JSON.stringify(this.pageDetails?.schema_markup) });
          }
        }
      })
    }, 1000);
  }

  getCustomerReviews() {
    this.apiService.post(`${AppConfig.apiUrl.common.getAllReviews}?active_status=1&page=1&limit=10&sortField=rating&sortOrder=DESC`, {}).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          this.customerReviews = response.data;
          // this.commonSvc.gsapBatchAnim('b2t');
        } else {
          this.alertService.error(response.message);
        }
      }
    });
  }

}

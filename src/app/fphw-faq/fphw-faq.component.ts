import { Component, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
import { FormValidationService } from '../@core/services/form-validation.service';
import { AlertService } from '../@core/services/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../@core/services/common.service';
import { ApiService } from '../@core/services/api.service';
import { AppConfig } from 'src/app/@utils/const/app.config';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from '../@core/services/utility.service';
import * as AOS from 'aos';
import { SharedService } from '../@core/services/shared.service';
import { Meta, Title } from '@angular/platform-browser';
declare var Swiper: any;
@Component({
  selector: 'app-fphw-faq',
  templateUrl: './fphw-faq.component.html',
  styleUrls: ['./fphw-faq.component.scss']
})
export class FPHWFaqComponent {
  public pageDetails:any={};
  selectedTab:number=1;
  constructor(
    private fb: FormBuilder,
    private router: Router,
     private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private apiService: ApiService,
    private commonSvc: CommonService,
    private formValidationService: FormValidationService,
    private utilityService: UtilityService,
    private sharedService: SharedService,
    private title: Title, private meta: Meta
  ) {

    this.selectedTab=1;
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
  }

  selectTab(tabNum:number){
    this.selectedTab=tabNum;
  }

}

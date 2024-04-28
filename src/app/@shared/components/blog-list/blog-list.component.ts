import { Component, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConfig } from 'src/app/@utils/const/app.config';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/@core/services/alert.service';
import { ApiService } from 'src/app/@core/services/api.service';
import { CommonService } from 'src/app/@core/services/common.service';
import { FormValidationService } from 'src/app/@core/services/form-validation.service';
import { UtilityService } from 'src/app/@core/services/utility.service';
import { Meta, Title } from '@angular/platform-browser';
declare var Swiper: any;


@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent {
  public blogList: any = [];
  public pageDetails:any={};
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private apiService: ApiService,
    private commonSvc: CommonService,
    private formValidationService: FormValidationService,
    private utilityService: UtilityService,
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
  }


  ngOnInit() {  
    this.getAllBlogs();
  }

  // ngAfterViewInit() {
  //   this.commonSvc.gsapInit();
  //   this.commonSvc.gsapBatchAnim();
  // }

  getAllBlogs() {
    this.apiService.get(`${AppConfig.apiUrl.common.getAllPosts}?active_status=1&page=1&limit=8`).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          this.blogList = response.data;
          setTimeout(() => {
            new Swiper('.swiper__blog-container', {
    
              spaceBetween: 10,
              //truewrapper adoptsheight of active slide
              // Optional parameters
              loop: false,
              // delay between transitions in ms
              autoplay: 4000,
              // If we need pagination
              // pagination: '.swiper-pagination',
              // paginationType: "bullets",
              // // Navigation arrows
              nextButton: '.swiper__blog-container--next',
              prevButton: '.swiper__blog-container--prev',
              // And if we need scrollbar
              //scrollbar: '.swiper-scrollbar',
              // "slide", "fade", "cube", "coverflow" or "flip"
              effect: 'slide',
              slidesPerView: 4,

              breakpoints: {
                990: {
                  slidesPerView: 3,
                  spaceBetween: 30
                },
                760: {
                  slidesPerView: 2,
                  spaceBetween: 10
                },
                575: {
                  slidesPerView: 1,
                  spaceBetween: 10
                },
              }
            });
          }, 100);

        } else {
          this.alertService.error(response.message);
        }
      }
    });
  }
}

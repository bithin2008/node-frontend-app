import { Component } from '@angular/core';
import { CommonService } from '../@core/services/common.service';
import { SharedService } from '../@core/services/shared.service';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';


declare var gsap: any;
declare var ScrollTrigger: any;

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent {
  public pageDetails:any={};
  constructor(
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
      this.meta.updateTag({ name: 'description', content: this.pageDetails?.meta_description?this.pageDetails?.meta_description:'' });
      this.meta.updateTag({ name: 'keywords', content: this.pageDetails?.meta_keywords?this.pageDetails?.meta_keywords:'' });
      this.meta.updateTag({ name: 'script', type: 'application/ld+json', content: this.pageDetails.schema_markup? JSON.stringify(this.pageDetails?.schema_markup):'' });
    }
  }
  selectedTab:number=1;
  selectTab(tabNum:number){
    this.selectedTab=tabNum;
  }

  ngAfterViewInit() {

    setTimeout(() => {
      this.commonSvc.gsapInit();
      // this.commonSvc.gsapTxtRevealAnim();
      // this.commonSvc.gsapImgRevealAnim();
    }, 700);
   
    setTimeout(() => {
      gsap.set(".line_draw .arwline path", {autoAlpha: 0});
     
      let planeTl = gsap.timeline({
        scrollTrigger: ({
          trigger: ".fp_process",
          start: 'top center',
          // end: 'center center',
          // markers: true
        }),
      });

      planeTl.to(".line_draw .arwline path", {
        autoAlpha: 1,
        stagger: -0.01, 
      });
      planeTl.fromTo(".paper-plane svg", {
        autoAlpha: 0,
        x: -5

      }, {
        autoAlpha: 1,
        x: 0
      })


    }, 2000);
  }
}

import { Component } from '@angular/core';
import { CommonService } from '../@core/services/common.service';
import { SharedService } from '../@core/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent {
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
      this.meta.updateTag({ name: 'description', content: this.pageDetails?.meta_description ? this.pageDetails?.meta_description : '' });
      this.meta.updateTag({ name: 'keywords', content: this.pageDetails?.meta_keywords ? this.pageDetails?.meta_keywords : '' });
      this.meta.updateTag({ name: 'script', type: 'application/ld+json', content: this.pageDetails.schema_markup ? JSON.stringify(this.pageDetails?.schema_markup) : '' });
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.sharedService.sharedPageData$.subscribe((response: any) => {
        if (response) {
          this.pageDetails = response.data;
          if(this.pageDetails){
            this.title.setTitle(this.pageDetails?.title);
            this.meta.updateTag({ name: 'description', content: this.pageDetails?.meta_description });
            this.meta.updateTag({ name: 'keywords', content: this.pageDetails?.meta_keywords });  
            this.meta.updateTag({ name: 'script', type: 'application/ld+json', content: JSON.stringify(this.pageDetails?.schema_markup) });      
          }       
        }
      })
    }, 1000);
  }
}

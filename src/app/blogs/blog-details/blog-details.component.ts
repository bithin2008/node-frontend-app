import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/@core/services/alert.service';
import { ApiService } from 'src/app/@core/services/api.service';
import { CommonService } from 'src/app/@core/services/common.service';
import { LoaderService } from 'src/app/@core/services/loader.service';
import { SharedService } from 'src/app/@core/services/shared.service';
import { AppConfig } from 'src/app/@utils/const/app.config';

declare var ScrollTrigger: any;

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent {
  public readMore = false;
  public currentSlug: any = '';
  public blogDetails: any = {};
  public currentScrollPosition: number = 0;
  public currentUrl: any = '';
  public disableBanner: boolean = false;
  public pageDetails: any = {};
  constructor(
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private loader: LoaderService,
    private router: Router,
    private apiService: ApiService,
    private commonSvc: CommonService,
    private sharedService: SharedService,
    private title: Title, private meta: Meta
  ) {

    this.activatedRoute.params.subscribe(params => {
      this.currentSlug = params['slug'];
      this.readMore = false;
      this.currentUrl = location.href;
    });

    const resolvedData = this.activatedRoute.snapshot.data['blogData'];
    if (resolvedData?.data) {
      this.blogDetails = resolvedData.data;
      this.title.setTitle(this.blogDetails?.meta_title);
      this.meta.removeTag('keyword');
      this.meta.removeTag('description');
      this.meta.updateTag({ name: 'description', content: this.blogDetails?.meta_description?this.blogDetails?.meta_description:'' });
      this.meta.updateTag({ name: 'keywords', content: this.blogDetails?.meta_keywords?this.blogDetails?.meta_keywords:'' });
      this.meta.updateTag({ name: 'script', type: 'application/ld+json', content: this.blogDetails.json_ld? JSON.stringify(this.blogDetails?.json_ld):'' });
      // ScrollTrigger.refresh();
      // this.commonSvc.gsapTxtRevealAnim();
      // this.commonSvc.gsapBatchAnim('b2t');
      setTimeout(() => {
        this.loader.hide();
      }, 1000);
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    // this.commonSvc.gsapInit();
    // this.commonSvc.gsapTxtRevealAnim();
    // this.commonSvc.gsapBatchAnim('b2t');

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

  onImgError(event: any) {
    event.target.src = 'https://placehold.co/1713x416';
    this.disableBanner = true;
  }



  getBlogDetails() {
    this.apiService.get(`${AppConfig.apiUrl.common.getPostsDetails}/${this.currentSlug}`).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          setTimeout(() => {
            this.loader.show();
          }, 100);
          this.blogDetails = response.data;
          ScrollTrigger.refresh();
          this.commonSvc.gsapTxtRevealAnim();
          this.commonSvc.gsapBatchAnim('b2t');
          setTimeout(() => {
            this.loader.hide();
          }, 1000);
        } else {
          this.alertService.error(response.message);
          this.router.navigate(['**'], { skipLocationChange: true });

          //  this.router.navigate('**');
        }
      }
    });
  }

  copyToClipboard() {
    // Use the Clipboard API to copy the URL to the clipboard
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData?.setData('text/plain', this.currentUrl);
      e.preventDefault();
    });
    document.execCommand('copy');
    this.alertService.success('Page url copied');
  }

  viewFullContent(ev: any) {
    if (this.readMore) {
      this.currentScrollPosition = ev.target.getBoundingClientRect().top + window.scrollY
    } else {
      window.scrollTo({ top: this.currentScrollPosition - 500, behavior: 'smooth' });
      this.currentScrollPosition = 0;
    }
  }




}

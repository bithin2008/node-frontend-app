import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormValidationService } from '../../@core/services/form-validation.service';
import { ApiService } from '../../@core/services/api.service';
import { AppConfig } from 'src/app/@utils/const/app.config';
import { AlertService } from '../../@core/services/alert.service';
import * as _ from "lodash";
import { CommonService } from '../../@core/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { SharedService } from 'src/app/@core/services/shared.service';
import { Meta, Title } from '@angular/platform-browser';
@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent {
  isDataLoaded:boolean=false;
  blogSearch:any='';
  blogList: any[] = [];
  latestBlogList: any[] = [];
  // Pagination Config
  paginationObj: any = {
    first: 0
  };
  currentPageIndex: number = 0;
  public pageDetails:any={};
  page: number = 1;
  itemPerPage: number = 7;
  searchKeyword: any = '';
  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private formValidationService: FormValidationService,
    private apiService: ApiService,
    private commonSvc: CommonService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private title: Title, private meta: Meta
  ) {

    this.activatedRoute.queryParams.subscribe(params => {
      this.page = parseInt(params['page']) || 1;
      this.paginationObj.first = (this.page - 1) * 10 || 0;
    });
  }

  ngOnInit(): void {
    this.getAllBlogs();
  }

  ngAfterViewInit() {
    
    this.commonSvc.gsapInit();
    this.commonSvc.gsapBatchAnim('b2t');
    setTimeout(() => {
      this.sharedService.sharedPageData$.subscribe((response: any) => {
        if (response) {
          this.pageDetails = response.data;
          if(this.pageDetails){
            this.title.setTitle(this.pageDetails?.title);
            this.meta.removeTag('keyword');
      this.meta.removeTag('description');
            this.meta.updateTag({ name: 'description', content: this.pageDetails?.meta_description });
            this.meta.updateTag({ name: 'keywords', content: this.pageDetails?.meta_keywords });  
            this.meta.updateTag({ name: 'script', type: 'application/ld+json', content: JSON.stringify(this.pageDetails?.schema_markup) });      
          }       
        }
      })
    }, 1000);
  }

  paginate(event: any) {
    window.scrollTo(0,0);
    this.paginationObj.first = event.first;
    this.page = event.page + 1;
    this.router.navigate(['/blogs'], {
      queryParams: {
        page: this.page
      },
      queryParamsHandling: 'merge',
    });
    this.getAllBlogs();
    
  }


  searchingBlog(ev:any){
    if (ev.target.value.length >= 3) {
      this.page=1;
      this.blogSearch=ev.target.value;
      this.getAllBlogs()
    } else {
      this.blogSearch = ''
    }
    if (ev.target.value.length == 0) {
      this.page=1;
      this.router.navigate(['/blogs'], {
        queryParams: {
          page: this.page
        },
        queryParamsHandling: 'merge',
      });
     this.getAllBlogs()
    }
  }

  getAllBlogs() {
    this.isDataLoaded=false;     
    this.blogList=[];
    this.apiService.get(`${AppConfig.apiUrl.common.getAllPosts}?page=${this.page}&limit=${this.itemPerPage}&search=${this.blogSearch}`).subscribe({
      next: (response: any) => {
        if (response.status == 1) {  
          this.isDataLoaded=true;       
          this.paginationObj = response?.pagination;
          this.paginationObj.first = (this.page - 1) * 10 || 0;
          this.blogList =  response.data;        
        } else {
          this.alertService.error(response.message);
        }
      }
    });
  }

}


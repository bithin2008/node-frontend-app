import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormValidationService } from '../@core/services/form-validation.service';
import { ApiService } from '../@core/services/api.service';
import { LoaderService } from '../@core/services/loader.service';
import { AppConfig } from 'src/app/@utils/const/app.config';
import { AlertService } from '../@core/services/alert.service';
import * as _ from "lodash";
import { CommonService } from '../@core/services/common.service';
import { Meta, Title } from '@angular/platform-browser';
import { SharedService } from '../@core/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-our-coverage',
  templateUrl: './our-coverage.component.html',
  styleUrls: ['./our-coverage.component.scss']
})
export class OurCoverageComponent {
  public addOnProductList: any[] = [];
  public productList: any[] = [];
  public pageDetails:any={};
  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private formValidationService: FormValidationService,
    private apiService: ApiService,
    private loader: LoaderService,
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
  ngOnInit(): void {
    this.getAllProducts();
    this.getAllAddonProducts();
  }
  // ngAfterViewInit() {
  //   this.commonSvc.gsapInit();
  //   this.commonSvc.gsapTxtRevealAnim();
  //   this.commonSvc.gsapImgRevealAnim();  
  // }
  onImgError(event: any) {
    event.target.src = 'assets/img/icon/adon-icon1.webp';
  }


  getAllProducts() {
    this.productList = [];
    this.apiService.get(`${AppConfig.apiUrl.common.getAllProducts}`).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          if (response.data.length > 0) {
            response.data.forEach((item: any) => {
              if (item.product_type == 1) {
                this.productList.push(item);
              }
            });
            this.productList=this.sortByPropertyName(this.productList, 'product_name');
          }
        } else {
          this.alertService.error(response.message);
        }
      }
    });
  }


  getAllAddonProducts() {
    this.apiService.get(`${AppConfig.apiUrl.common.getAllAddonProducts}?active_status=1`).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          this.addOnProductList = response.data;
          this.addOnProductList.sort();
          this.addOnProductList=this.sortByPropertyName(this.addOnProductList, 'product_name');
        } else {
          this.alertService.error(response.message);
        }
      }
    });
  }

  sortByPropertyName(arr: any[], propertyName: string): any[] {
    return arr.slice().sort((a, b) => {
      const nameA = a[propertyName].toUpperCase(); // Convert to uppercase for case-insensitive sorting
      const nameB = b[propertyName].toUpperCase();
  
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }

}

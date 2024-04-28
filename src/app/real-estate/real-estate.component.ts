import { Component, Renderer2, ElementRef } from '@angular/core';
import { FormValidationService } from '../@core/services/form-validation.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../@core/services/alert.service';
import { ApiService } from '../@core/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig } from 'src/app/@utils/const/app.config';
import { CommonService } from '../@core/services/common.service';
import { SharedService } from '../@core/services/shared.service';
import { Meta, Title } from '@angular/platform-browser';
import { ReCaptchaV3Service } from 'ng-recaptcha';
declare var Swiper: any;
declare var google: any;

@Component({
  selector: 'app-real-estate',
  templateUrl: './real-estate.component.html',
  styleUrls: ['./real-estate.component.scss']
})
export class RealEstateComponent {
  public customerReviews: any = [];
  public realEstateForm!: FormGroup;
  public realEstateFormSubmitted: boolean = false;
  public validZip: boolean = false;
  public validZipMessage: any = '';
  public realEstateModal: boolean = false;
  public isReadOnly: boolean = true;
  public pageDetails: any = {};
  public loading: boolean = false;
public ziploading: boolean = false;
  
  public options = {
    types: ["address"],
    componentRestrictions: {
      country: 'us'
    }    
  };
  constructor(private fb: FormBuilder,
    private alertService: AlertService,
    private formValidationService: FormValidationService,
    private apiService: ApiService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private renderer: Renderer2,
    private el: ElementRef,
    private commonSvc: CommonService,
    private sharedService: SharedService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private title: Title, private meta: Meta) {
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

    this.realEstateForm = this.fb.group({
      companyName: ['', [Validators.required, this.formValidationService.notEmpty]],
      contactName: ['', [Validators.required, this.formValidationService.notEmpty]],
      emailId: ['', [Validators.required, this.formValidationService.notEmpty, this.formValidationService.validEmail]],
      mobileNo: ['', [Validators.required, this.formValidationService.phoneNumberUS,]],
      address: ['N/A'],
      accountType: ['', [Validators.required]],
      officeLocation: ['N/A'],
      officeAddress: ['', [Validators.required]],
      officeZip: ['', [Validators.required]],
      officeCity: ['', [Validators.required]],
      officeState: ['', [Validators.required]],
    });
  }

  get s1() { return this.realEstateForm.controls; }

  ngAfterViewInit() {
    this.formValidationService.forms();
    this.getCustomerReviews();
    // this.commonSvc.gsapInit();
    // setTimeout(() => {     
    //   this.commonSvc.gsapImgRevealAnim();
    //   this.commonSvc.gsapTxtRevealAnim();
    //   this.commonSvc.gsapBatchB2T();
    // }, 500);
  }

  getZipCodeFromPlace(place:any) {
    for (var i = 0; i < place.address_components.length; i++) {
      for (var j = 0; j < place.address_components[i].types.length; j++) {
        if (place.address_components[i].types[j] == "postal_code") {
          return  place.address_components[i].long_name;
        }
      }
    }  
    return null;
  }

  getCustomerReviews() {
    this.apiService.post(`${AppConfig.apiUrl.common.getAllReviews}?active_status=1&page=1&limit=10&sortField=rating&sortOrder=DESC`, {}).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          this.customerReviews = response.data;
          setTimeout(() => {
            new Swiper('.review_slider', {
              loop: true,
              autoplay: 2000,
              waitForTransition: true,
              effect: "fade",
              navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              },
              paginationType: 'bullets',
              pagination: '.swiper-pagination',
              paginationClickable: true,

            });
          }, 500);
        } else {
          this.alertService.error(response.message);
        }
      }
    });
  }

  changeMobileFormat(e: any) {
    this.realEstateForm.controls['mobileNo'].setValue(this.commonSvc.setUSFormatPhoneNumber(e.target.value.toString()));
  }

  chekcZipCode(ev: any) {
    if (ev.target.value.length > 4) {
      this.validZip = false;
      this.validZipMessage = '';
      this.ziploading = true;   
      this.apiService.post(AppConfig.apiUrl.common.locationByZip, { zip: ev.target.value.toString() }).subscribe({
        next: (response: any) => {
          if (response.status == 1) {
            if (response.data.is_serviceable == 1 && response.data.active_status == 1) {
              this.validZip = true;
              this.realEstateForm.patchValue({
                officeState: response.data.state,
                officeCity: response.data.city
              });
              this.formValidationService.forms();
            } else {
              this.validZipMessage = 'Unavailable services in this zip code';
            }
          } else {
            this.validZipMessage = response.message;
            this.realEstateForm.patchValue({
              officeState: '',
              officeCity: ''
            });
          }
        },
        error: (er) => {
          this.ziploading = false;
        },
        complete: () => {
          if (!this.validZip) {
            this.realEstateForm.patchValue({
              officeState: '',
              officeCity: ''
            });
          }
          this.ziploading = false;
        }
      });
    } else {
      this.validZipMessage = '';
      this.realEstateForm.patchValue({
        officeState: '',
        officeCity: ''
      });
    }
  }

  async realEstateFormSubmit() {
    if (!this.realEstateForm.valid) {
      this.formValidationService.validateAllFormFields(this.realEstateForm);
      return
    }
    console.log('this.contactForm.value', this.realEstateForm.value);
    this.realEstateForm.value.createUserType = 3;
    this.realEstateForm.value.mobileNo = this.commonSvc.convertToNormalPhoneNumber(this.s1['mobileNo'].value);
    this.loading=true;
    const token = await this.recaptchaV3Service.execute('submitAffiliates').toPromise();
    let res: any = await this.commonSvc.verifyreCaptcha(token);
    if (res.status == 1) {     
      this.apiService.post(`${AppConfig.apiUrl.realEstate.submitRealEstateProfessional}`, this.realEstateForm.value).subscribe({
        next: (response: any) => {
          console.log('response', response);
          if (response.status == 1) {
            this.loading=false;
            this.realEstateForm.reset();
            this.realEstateModal = false;
            this.renderer.removeClass(document.body, 'modal_body_root');
            this.router.navigate(['/real-estate-professionals/thank-you']);
          } else {
            this.loading=false;
            this.alertService.error(response.message);
          }
        }
      });
    }else{
      this.loading=false;
    }
  }

  openRealEstateProfessionalModal() {
    this.loading=false;
    this.realEstateModal = true;
    if (this.realEstateModal) {
      this.renderer.addClass(document.body, 'modal_body_root');
      this.realEstateForm.patchValue({
        accountType: '1'
      })

      let input:any = document.getElementById("addressBar");
      const autocomplete = new google.maps.places.Autocomplete(input, this.options);
      autocomplete.addListener("place_changed", () => {
        this.realEstateForm.patchValue({
          officeAddress: input.value,                 
        })
        const place = autocomplete.getPlace();
        var zipCode = this.getZipCodeFromPlace(place);
        console.log('zipCode',zipCode);
        
        if(zipCode){
          this.realEstateForm.patchValue({
            officeZip: zipCode,                 
          })
          let zipData:any={
            target:{
              value:zipCode
            }
          }          
        this.chekcZipCode(zipData);   
        this.formValidationService.forms();               
        }                
      });
    }
  }


  closeRealEstateModal() {
    this.realEstateModal = false;
    this.formValidationService.validateAllFormFields(this.realEstateForm);
    this.realEstateForm.reset();
    this.formValidationService.forms();
    this.renderer.removeClass(document.body, 'modal_body_root');
  }

  gotoToPortal() {
    this.router.navigate(['realestate-professional-portal']);
  }
}

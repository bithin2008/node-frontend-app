import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef, NgZone } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { FormValidationService } from '../@core/services/form-validation.service';
import { ApiService } from '../@core/services/api.service';
import { LoaderService } from '../@core/services/loader.service';
import { AppConfig } from 'src/app/@utils/const/app.config';
import { AlertService } from '../@core/services/alert.service';
import { CdkStepper } from '@angular/cdk/stepper';
import { CommonService } from '../@core/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import * as _ from "lodash";
import { SharedService } from '../@core/services/shared.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
declare var Swiper: any;

@Component({
  selector: 'app-contractor',
  templateUrl: './contractor.component.html',
  styleUrls: ['./contractor.component.scss']
})
export class ContractorComponent {
  @ViewChild(CdkStepper) stepper!: CdkStepper;
  @ViewChild('contractorForm') private contractorForm: ElementRef | any;
  public stepOneForm!: FormGroup;
  public stepTwoForm!: FormGroup;
  public stepThreeForm!: FormGroup;
  public stepOneSubmitted: boolean = false;
  public stepTwoSubmitted: boolean = false;
  public stepThreeSubmitted: boolean = false;
  public loading: boolean = false;


  public selectAll: boolean = false;
  public productList: any = [];
  public customerReviews: any = [];
  public isReadOnly: boolean = true;


  public validZip: boolean = false;
  public validZipMessage: any = '';

  public activeStep: number = 1
  public selectedServiceType: any = [];
  public uploadedLicense: any = '';
  public zipCodeList: any = [];
  public dropdownSettings = {};
  public serviceCity: any = [];
  public pageDetails: any = {};
  public addOnProductList: any = [];

  virtualSlides = Array.from({ length: 6 }).map((el, index) => `Slide ${index + 1}`);
  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private formValidationService: FormValidationService,
    private apiService: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commonSvc: CommonService,
    private sharedService: SharedService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private zone: NgZone,
    private title: Title,
    private meta: Meta
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

    this.stepOneForm = this.fb.group({
      companyName: ['', [Validators.required, this.formValidationService.notEmpty]],
      firstName: ['', [Validators.required, this.formValidationService.notEmpty]],
      lastName: ['', [Validators.required, this.formValidationService.notEmpty]],
      companyPhone: ['', [Validators.required, this.formValidationService.phoneNumberUS,]],
      mobileNo: ['', [Validators.required, this.formValidationService.phoneNumberUS,]],
      licenseNumber: ['', [Validators.required]],
      dontHaveLicense: [false],
    });

    this.stepTwoForm = this.fb.group({
      emailId: ['', [Validators.required, this.formValidationService.notEmpty, this.formValidationService.validEmail]],
      zipCode: ['', [Validators.required]],
      addressOne: ['', [Validators.required, this.formValidationService.notEmpty]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      contractorsNumber: ['', [Validators.required]],
      serviceCity: ['', [Validators.required]],
      radialDistance: ['', [Validators.required]],
      serviceCallFee: ['', [Validators.required]],
    });

    this.stepThreeForm = this.fb.group({
      serviceTypes: ['', [Validators.required]],
      licenseFile: ['', [Validators.required]]
    });

    this.stepThreeForm.controls['serviceTypes'].valueChanges.subscribe((selectedValues) => {
      console.log('Selected Values:', selectedValues);
    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'zipcode',
      textField: 'zipcode',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }


  async ngAfterViewInit() {
    const realFileBtn: any = document.getElementById("real-file");
    const customBtn: any = document.getElementById("file-upload-btn");
    const customTxt: any = document.getElementById("custom-text");
    customBtn.addEventListener("click", function () {
      realFileBtn.click();
    });
    realFileBtn.addEventListener("change", function () {
      if (realFileBtn.value) {
        customTxt.innerHTML = realFileBtn.value.match(
          /[\/\\]([\w\d\s\.\-\(\)]+)$/
        )[1];
        customTxt.style.display = 'block';
      }
      else {
        customTxt.innerHTML = "No file chosen, yet.";
      }
    });

    this.stepper.selectedIndex = 0;
    this.formValidationService.forms();

    this.productList = await this.getAllProducts();
    this.addOnProductList = await this.getAllAddonProducts();
    if (this.productList) {
      this.productList = this.productList.concat(this.addOnProductList);
    }
  }

  preventNumberInput(e: any) {
    var keyCode = (e.keyCode ? e.keyCode : e.which);
    if (keyCode > 47 && keyCode < 58 || keyCode > 95 && keyCode < 107) {
      e.preventDefault();
    }
  }

  mszKeyDown(e: any): any {
    if (e.which === 32 && !e.target.value.length) {
      e.preventDefault();
    }
  }

  searchZipCode(ev: any) {
    document.querySelector('.form-zips')?.classList.add('has-value');

    if (ev.target.value.length > 2) {

      this.apiService.post(AppConfig.apiUrl.common.searchZipcode, { zipcode: ev.target.value.toString() }).subscribe({
        next: (response: any) => {
          if (response.status == 1) {
            this.zone.run(() => {
              this.zipCodeList = response.data;

            });
          }
        }
      });
    } else {
      this.zipCodeList = [];
    }

  }

  zipfocus(ev: any) {
    // document.querySelector('.form-zips')?.classList.add('has-value');
  }

  onItemUnselect(ev: any) {
    console.log('onItemUnselect', ev);



    this.serviceCity = this.serviceCity.filter((item: any) => item !== ev);
    this.stepTwoForm.patchValue({
      serviceCity: this.serviceCity
    })
    if (this.serviceCity.length > 0) {

      //document.querySelector('.form-zips')?.classList.add('has-value');
    }
    else {
      console.log(666);
      document.querySelector('.form-zips')?.classList.remove('has-value');
    }
  }

  clearData() {
    this.zipCodeList = [];
  }

  selectZipCode(ev: any) {
    console.log('onItemselect');
    document.querySelector('.form-zips')?.classList.add('has-value');
    this.serviceCity.push(ev.zipcode);
    this.stepTwoForm.patchValue({
      serviceCity: this.serviceCity
    })
  }

  get s1() { return this.stepOneForm.controls; }
  get s2() { return this.stepTwoForm.controls; }
  get s3() { return this.stepThreeForm.controls; }

  get selectedService(): FormArray {
    return this.stepThreeForm.get('serviceTypes') as FormArray;
  }

  onStepChanged(stepNum: number) {
    console.log('this.stepper', this.stepper);
    if (stepNum == 2) {
      if (!this.stepOneForm.valid) {
        return
      }
    }
    if (stepNum == 3) {
      if (!this.stepTwoForm.valid) {
        return
      }
      if (this.stepOneForm.controls['dontHaveLicense'].value) {
        this.stepThreeForm.controls['licenseFile'].clearValidators();
        this.stepThreeForm.controls['licenseFile'].updateValueAndValidity();


        let fileUpload: any = document.getElementById('license_upload');
        fileUpload.style.display = 'none';
      } else {
        this.stepThreeForm.controls['licenseFile'].setValidators([Validators.required]);
        this.stepThreeForm.controls['licenseFile'].updateValueAndValidity();

        let fileUpload: any = document.getElementById('license_upload');
        fileUpload.style.display = 'block';
      }
    }

    this.activeStep = stepNum;
    this.stepper.selectedIndex = stepNum - 1;
  }

  dontHaveALicense() {
    if (this.s1['dontHaveLicense'].value) {
      this.stepOneForm.controls['licenseNumber'].disable();
      this.stepOneForm.controls['licenseNumber'].clearValidators();
      this.stepOneForm.controls['licenseNumber'].updateValueAndValidity();
      this.stepOneForm.patchValue({
        licenseNumber: ''
      });
      if (this.stepThreeForm) {
        this.stepThreeForm.patchValue({
          licenseFile: ''
        });
      }
      this.clearFileInput();
    } else {
      this.stepOneForm.controls['licenseNumber'].enable();
      this.stepOneForm.controls['licenseNumber'].setValidators([Validators.required]);
      this.stepOneForm.controls['licenseNumber'].updateValueAndValidity();
    }

  }

  selectAllServices() {
    let checkboxList: any = document.getElementsByClassName('serviceTypesCheckbox');

    [...checkboxList].forEach((element) => {
      if (this.selectAll) {
        element.checked = true;
        this.productList.forEach((item: any) => {
          this.selectedServiceType.push({ product_id: item.product_id, product_name: item.product_name });
          this.selectedServiceType = _.uniqBy(this.selectedServiceType, 'product_id');
          this.stepThreeForm.controls['serviceTypes'].clearValidators();
          this.stepThreeForm.controls['serviceTypes'].updateValueAndValidity();
        });

      } else {
        element.checked = false;
        this.selectedServiceType = [];
        this.stepThreeForm.patchValue({
          serviceTypes: ''
        });
        this.stepThreeForm.controls['serviceTypes'].setValidators([Validators.required]);
        this.stepThreeForm.controls['serviceTypes'].updateValueAndValidity();
      }
    });
  }

  changePhoneFormat(e: any) {
    this.stepOneForm.controls['companyPhone'].setValue(this.commonSvc.setUSFormatPhoneNumber(e.target.value.toString()));
  }

  changeMobileFormat(e: any) {
    this.stepOneForm.controls['mobileNo'].setValue(this.commonSvc.setUSFormatPhoneNumber(e.target.value.toString()));
  }

  fileChangeEvent(event: any): void {
    const fileSize = event.target.files[0].size / 1024 / 1024; // in MB
    let customTxt: any = document.getElementById("custom-text");
    customTxt.innerHTML = '';
    if (fileSize > 6) {
      this.alertService.warning('File size exceeds 6 MB',);
      this.clearFileInput();
      this.stepThreeForm.patchValue({
        licenseFile: null
      })
      return
    }
    let validation: any = this.commonSvc.validateFileUpload(event.target.files[0].name, ['docx', 'doc', 'pdf']);
    if (validation) {
      this.uploadedLicense = event.target.files[0];

      customTxt.innerHTML = this.uploadedLicense.name;
    } else {
      this.clearFileInput();
      this.alertService.warning('Only docs, pdf formats are supported');
      this.stepThreeForm.patchValue({
        licenseFile: null
      })
      return
    }
  }

  clearFileInput() {
    // Reset the input field by setting its value to an empty string
    var el: any = document.getElementById('real-file');
    el.value = '';
  }

  onSelectServiceType(event: any, item: any) {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.selectedServiceType.push({ product_id: item.product_id, product_name: item.product_name });
    } else {
      this.selectedServiceType = _.reject(this.selectedServiceType, { 'product_id': item.product_id });
    }
    this.selectedServiceType = _.uniqBy(this.selectedServiceType, 'product_id');
    console.log('this.selectedServiceType', this.selectedServiceType);

    if (this.productList.length == this.selectedServiceType.length) {
      this.selectAll = true;
    } else {
      this.selectAll = false
    }

    if (this.selectedServiceType.length > 0) {
      this.stepThreeForm.controls['serviceTypes'].clearValidators();
      this.stepThreeForm.controls['serviceTypes'].updateValueAndValidity();

    } else {
      this.stepThreeForm.patchValue({
        serviceTypes: ''
      });
      this.stepThreeForm.controls['serviceTypes'].setValidators([Validators.required]);
      this.stepThreeForm.controls['serviceTypes'].updateValueAndValidity();
    }
  }

  getAllProducts() {
    return new Promise<void>((resolve, reject) => {
      this.apiService.get(`${AppConfig.apiUrl.common.getAllProducts}`).subscribe({
        next: (response: any) => {
          if (response.status == 1) {
            resolve(response.data)
          }
        },
        error: (err) => {
          reject(err)
        },
      })
    })
  }

  getAllAddonProducts() {
    return new Promise<void>((resolve, reject) => {
      this.apiService.get(`${AppConfig.apiUrl.common.getAllAddonProducts}?active_status=1`).subscribe({
        next: (response: any) => {
          if (response.status == 1) {
            resolve(response.data)
          }
        },
        error: (err) => {
          reject(err)
        },
      })
    })
  }

  scrollToContractorForm() {
    this.contractorForm.nativeElement.scrollIntoView({ behavior: 'smooth', })
  }

  chekcZipCode(ev: any) {
    if (ev.target.value.length > 4) {
      this.validZip = false;
      this.validZipMessage = '';
      this.apiService.post(AppConfig.apiUrl.common.locationByZip, { zip: ev.target.value.toString() }).subscribe({
        next: (response: any) => {
          if (response.status == 1) {
            if (response.data.is_serviceable == 1 && response.data.active_status == 1) {
              this.validZip = true;
              this.stepTwoForm.patchValue({
                state: response.data.state,
                city: response.data.city
              });
              this.formValidationService.forms();
            } else {
              this.validZipMessage = 'Unavailable services in this zip code';
            }
          } else {
            this.validZipMessage = response.message;
            this.stepTwoForm.patchValue({
              state: '',
              city: ''
            });
          }
        },
        error: (er) => {
        },
        complete: () => {
          if (!this.validZip) {
            this.stepTwoForm.patchValue({
              state: '',
              city: ''
            });
          }

        }
      });
    } else {
      this.validZipMessage = '';
      this.stepTwoForm.patchValue({
        state: '',
        city: ''
      });
    }
  }

  async stepOneSubmit() {
    if (!this.stepOneForm.valid) {
      this.formValidationService.validateAllFormFields(this.stepOneForm);
      return
    }
    this.stepper.next();
    this.activeStep = 2;
    this.formValidationService.forms();
  }

  async stepTwoSubmit() {
    if (!this.stepTwoForm.valid) {
      this.formValidationService.validateAllFormFields(this.stepTwoForm);
      return
    }
    this.stepper.next();
    if (this.stepOneForm.controls['dontHaveLicense'].value) {
      this.stepThreeForm.controls['licenseFile'].clearValidators();
      this.stepThreeForm.controls['licenseFile'].updateValueAndValidity();
      let fileUpload: any = document.getElementById('license_upload');
      fileUpload.style.display = 'none';
    } else {
      this.stepThreeForm.controls['licenseFile'].setValidators([Validators.required]);
      this.stepThreeForm.controls['licenseFile'].updateValueAndValidity();
      let fileUpload: any = document.getElementById('license_upload');
      fileUpload.style.display = 'block';
    }
    this.activeStep = 3;
    this.formValidationService.forms();
  }


  async stepThreeSubmit() {


    // let selectedProductCount = _.filter(this.productList,{isSelected:true})
    // if(selectedProductCount.length==0){
    //   this.alertService.error('Choose your service areas');
    //   return;
    // }
    if (!this.stepThreeForm.valid) {
      this.formValidationService.validateAllFormFields(this.stepThreeForm);
      return
    }
    let contractorData: any = { ...this.stepOneForm.value, ...this.stepTwoForm.value, ...this.stepThreeForm.value };
    console.log('contractorData', contractorData);
    contractorData.createUserType = 4;
    contractorData.selectedServiceTypes = this.selectedServiceType;
    this.loading = true;
    contractorData.serviceCity = JSON.stringify(contractorData.serviceCity)
    const token = await this.recaptchaV3Service.execute('submitContractor').toPromise();
    let res: any = await this.commonSvc.verifyreCaptcha(token);

    if (res.status == 1) {
      this.apiService.post(`${AppConfig.apiUrl.contractors.createContractor}`, contractorData).subscribe({
        next: (response: any) => {
          console.log('response', response);
          if (response.status == 1) {
            this.loading = false;
            if (!this.s1['dontHaveLicense'].value) {
              this.updateLicense(response.data.contractor_id);
            } else {
              this.loading = false;
              this.stepOneForm.reset();
              this.stepTwoForm.reset();
              this.stepThreeForm.reset();
              this.router.navigate(['/contractors/thank-you']);
            }
          } else {
            this.loading = false;
          }
        }
      });
    } else {
      this.loading = false;
    }


  }

  async updateLicense(contractor_id: any) {
    if (!this.s3['licenseFile'].value) {
      return
    }
    const formData = new FormData();
    let fileName = this.s3['licenseFile'].value.substring(this.s3['licenseFile'].value.lastIndexOf("/") + 1);
    formData.append('licenseFile', this.uploadedLicense, fileName);
    this.uploadLicense(contractor_id, formData);

  }

  uploadLicense(contractor_id: string, formData: any) {
    this.apiService.fileupload(`${AppConfig.apiUrl.contractors.uploadLicense}/${contractor_id}`, formData).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          this.stepOneForm.reset();
          this.stepTwoForm.reset();
          this.stepThreeForm.reset();
          this.clearFileInput();
          // this.alertService.success(response.message);
          let customTxt: any = document.getElementById("custom-text");
          customTxt.innerHTML = '';
          var el: any = document.getElementById('real-file');
          if (el)
            el.value = '';
          this.router.navigate(['/contractors/thank-you']);
        }
      },
      error: (err) => { }, complete: () => { },
    })
  }
}

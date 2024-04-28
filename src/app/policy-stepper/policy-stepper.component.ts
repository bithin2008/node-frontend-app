import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormValidationService } from '../@core/services/form-validation.service';
import { ApiService } from '../@core/services/api.service';
import { LoaderService } from '../@core/services/loader.service';
import { AppConfig } from 'src/app/@utils/const/app.config';
import { AlertService } from '../@core/services/alert.service';
import { CdkStepper } from '@angular/cdk/stepper';
import * as _ from "lodash";
import { CommonService } from '../@core/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SharedService } from '../@core/services/shared.service';
import { Meta, Title } from '@angular/platform-browser';
import { ReCaptchaV3Service } from 'ng-recaptcha';
declare var google: any;
@Component({
  selector: 'app-policy-stepper',
  templateUrl: './policy-stepper.component.html',
  styleUrls: ['./policy-stepper.component.scss']
})
export class PolicyStepperComponent implements OnInit {
  @ViewChild(CdkStepper) stepper!: CdkStepper;
  @ViewChild('optionalPlan') private optionalPlan: ElementRef | any;
  @ViewChild('stepFour') stepFour!: ElementRef;
  public stepOneForm: FormGroup;
  public stepTwoForm: FormGroup;
  public stepThreeForm: FormGroup;
  public stepFourForm: FormGroup;
  public stepOneSubmitted: boolean = false;
  public stepTwoSubmitted: boolean = false;
  public stepThreeSubmitted: boolean = false;
  public stepFourSubmitted: boolean = false;
  public loading: boolean = false;
  public loading2: boolean = false;
  public ziploading: boolean = false;

  public validZip: boolean = false;
  public validBillingZip: boolean = false;



  isExpanded: boolean = false;
  public leadId: string = '';
  public leadDetails: any = {};
  public sessionId: string = '';
  public planList: any = [];
  public planTerm: boolean = true;
  public totalPolicyTerm: any = '';
  public planTermsId: any = '';
  public propertyTypes: any = [];
  public addOnProductList: any[] = [];
  public policyTerm: any = [];
  public propertyTypeText: any = '';
  public selectdAddOnProducts: any = [];
  public selectedPlanPrice: number = 0;
  public totalAddonProductPrice: number = 0;
  public displayedAddonItems: number = 14;
  public showMoreItemAddon: boolean = false;
  public planTermSelection: any = 12;
  public isSamePropertyAddress: boolean = false;
  public activePlan: any = {};


  public groupedData: any = [];

  public planWiseProductList: any[] = [];
  public currenctPaymentType: number = 1;
  public showAddonItem: boolean = true;

  public stepperBackBtn: boolean = false;
  public currentStep: number = 0;
  public termsCondition: boolean = false;
  public validZipMessage: any = '';
  public validBillingZipMessage: any = '';

  public creditCardNumber: any = '';
  options = {
    types: ["address"],
    componentRestrictions: {
      country: 'us'
    }

  };
  public pageDetails: any = {};
  public utmId: any = '';
  public clickId: any = '';
  private updateFieldSubject = new Subject<any>();
  private updateFieldSubscription!: Subscription;
  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private formValidationService: FormValidationService,
    private apiService: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private recaptchaV3Service: ReCaptchaV3Service,
    private commonSvc: CommonService,
    private sharedService: SharedService,
    private title: Title, private meta: Meta,
    private renderer: Renderer2
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

    // this.alertService.error('AAAAAA');response.message);
    this.stepOneForm = this.fb.group({
      firstName: ['', [Validators.required, this.formValidationService.notEmpty]],
      lastName: ['', [Validators.required, this.formValidationService.notEmpty]],
      emailId: ['', [Validators.required, this.formValidationService.notEmpty, this.formValidationService.validEmail,]],
      mobileNo: ['', [Validators.required, this.formValidationService.phoneNumberUS,]],
    });
    this.stepTwoForm = this.fb.group({
      propertyZipCode: [localStorage.getItem('zip') ? localStorage.getItem('zip') : '', [Validators.required]],
      propertyAddressOne: ['', [Validators.required, this.formValidationService.notEmpty]],
      propertyState: ['', [Validators.required]],
      propertyCity: ['', [Validators.required]],
      propertyTypeId: ['', [Validators.required, this.formValidationService.notEmpty]],
      propertySizeId: ['0', [Validators.required]],
    });

    this.stepThreeForm = this.fb.group({
      // city: ['', [Validators.required, this.formValidationService.notEmpty]],
      // country: ['', [Validators.required, this.formValidationService.notEmpty]],
    });

    this.stepFourForm = this.fb.group({
      billingCity: [''],
      billingState: [''],
      billingZipCode: ['', [Validators.required, this.formValidationService.numericOnly]],
      billingAddress: ['', [Validators.required, this.formValidationService.notEmpty]],

      bankAccountHolderName: ['', [Validators.required, this.formValidationService.notEmpty]],
      bankAccountNumber: ['', [Validators.required]],
      routingNumber: ['', [Validators.required, this.formValidationService.usBankRouting]],

      cardHolderName: ['', [Validators.required]],
      cardNumber: ['', [Validators.required]],
      expiryDate: ['', [Validators.required, this.formValidationService.validateExpirationDateFormat, this.formValidationService.expiryDateValidator]],
      cvv: ['', [Validators.required, this.formValidationService.validateCVV]]
    });

    if (localStorage.getItem('zip')) {
      let data: any = {
        target: {
          value: localStorage.getItem('zip')
        }
      }
      this.chekcZipCode(data);
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

  ngOnInit(): void {
    if (this.isNewSession()) {
      console.log("This is a new session.");
      sessionStorage.setItem("sessionStarted", "true");
      let session = this.generateSessionId();
      localStorage.setItem('session_id', session);
    } else {
      console.log("This is an existing session.");
    }
    if (localStorage.getItem('step') == 'step-1') {
      this.getLeadDetailsByEmailAndSessionId();
    }

    this.getAllPropertyTypes();
    this.getAllPlans();
    this.getAllAddonProducts();
    this.getAllPolicyTerms();

    this.updateFieldSubscription = this.updateFieldSubject
      .pipe(
        debounceTime(700),
        distinctUntilChanged(),
        switchMap((data: any) => {
          return this.apiService.post(
            `${AppConfig.apiUrl.lead.createUpdateLeadByField}`, data
          );
        })
      )
      .subscribe((response: any) => {
        localStorage.setItem('lead_obj', JSON.stringify(response.data.lead_data));
      });
  }

  ngAfterViewInit() {
    this.formValidationService.forms();

    let expiryDateInput: any = document.getElementById('expiryDate');
    if (expiryDateInput) {
      expiryDateInput.addEventListener('input', (e: any) => {
        let input = e.target.value;
        input = input.replace(/\D/g, ''); // Remove non-numeric characters
        if (input.length > 2) {
          input = input.slice(0, 2) + '/' + input.slice(2);
        }
        e.target.value = input;
      });
    }

 
  }

  expiryDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (!control.value) {
      return null; // Don't perform validation if the field is empty
    }

    const currentDate = new Date();
    const enteredDate = new Date(`01/${control.value}`);

    if (enteredDate < currentDate) {
      return { 'expired': true };
    }

    return null;
  }



  get s1() { return this.stepOneForm.controls; }
  get s2() { return this.stepTwoForm.controls; }
  get s4() { return this.stepFourForm.controls; }

  isNewSession() {
    return sessionStorage.getItem("sessionStarted") !== "true";
  }

  generateSessionId() {
    sessionStorage.setItem("SessionName", "SessionData");
    return Math.random().toString(36).substr(2, 20); // Generate a random alphanumeric string
  }

  getAllPropertyTypes() {
    this.apiService.get(`${AppConfig.apiUrl.common.getAllpropertyTypes}`).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          this.propertyTypes = response.data;
          this.loading = false;
        } else {
          this.alertService.error(response.message);
        }
      }
    });
  }

  getLeadDetailsByEmailAndSessionId() {
    let data = {
      sessionId: localStorage.getItem('session_id'),
      emailId: localStorage.getItem('email'),
      mobileNo: localStorage.getItem('mobile'),
    }
    this.apiService.post(AppConfig.apiUrl.lead.getLeadDetailsByEmailAndSessionId, data).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          this.stepOneForm.patchValue({
            firstName: response.data.first_name,
            lastName: response.data.last_name,
          });
          this.stepper.next();
          window.scrollTo(0, 0);
          this.loading = false;
        } else {
          this.alertService.error(response.message);
        }
      }
    });
  }

  getAllPlans() {
    this.apiService.get(`${AppConfig.apiUrl.common.getAllPlans}?active_status=1`).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          response.data.forEach((element: any) => {
            if (element.plan_id == 2) {
              this.activePlan = element
            }

            element.displayedItems = 12;
            this.planList.push(element)
          });
          this.planList.forEach((element: any) => {
            if (element.plan_id == 2) {
              element.is_active = true;
            }
            element.product_list.forEach((item: any) => {
              item['plan_id'] = element.plan_id;
              let isExist;
              if (this.planWiseProductList.length > 0) {
                isExist = _.find(this.planWiseProductList, { 'product_id': item.product_id });
              }
              if (isExist) {
                this.planWiseProductList = _.reject(this.planWiseProductList, { 'product_id': item.product_id });
                item['exist_in_both_plan'] = true
              } else {
                item['exist_in_both_plan'] = false
              }
              this.planWiseProductList.push(item);
            });
          });
          this.planWiseProductList = _.unionBy(this.planWiseProductList, 'product_id');
          let filteredArray: any = _.filter(this.planWiseProductList, { 'exist_in_both_plan': false });

          filteredArray.forEach((item: any) => {
            this.planWiseProductList.forEach((obj: any, index: number) => {
              if (item.product_id == obj.product_id) {
                this.planWiseProductList.splice(index, 1);
                this.planWiseProductList.push(item);
              }
            });
          });
          this.planWiseProductList = this.planWiseProductList.sort((a, b) => {
            if (a.sequence === null && b.sequence !== null) {
              return 1; // Move items with null sequence to the end
            } else if (a.sequence !== null && b.sequence === null) {
              return -1; // Move items with non-null sequence to the beginning
            } else {
              return a.sequence - b.sequence; // Regular sorting for non-null sequences
            }
          });
          this.loading = false;
        } else {
          this.alertService.error(response.message);
        }
      }
    });
  }

  getAllPolicyTerms() {
    this.apiService.get(`${AppConfig.apiUrl.policyTerm.getAllPolicyTerms}?show_website=1`).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          this.groupedData = response?.data.reduce((result: any, item: any) => {
            const month = item.plan_term_month;
            // Check if there's already an array for the current month
            if (!result[month]) {
              result[month] = [];
            }
            // Add the item to the array for the current month
            result[month].push(item);
            return result;
          }, {});


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
          this.loading = false;
        } else {
          this.alertService.error(response.message);
        }
      }
    });
  }

  allowOnlyNumber(event: any) {
    let inputValue: any = event.target.value;
    inputValue = inputValue.replace(/[^0-9]/g, '');
    inputValue = inputValue.slice(0, 5);
    this.stepTwoForm.patchValue({
      propertyZipCode: inputValue
    });
  }

  chekcZipCode(ev: any) {
    if (ev.target.value.length > 4) {
      this.validZip = false;
      this.validZipMessage = '';
      this.ziploading = true;
      this.apiService.post(AppConfig.apiUrl.common.locationByZip, { zip: ev.target.value.toString() }).subscribe({
        next: (response: any) => {
          this.ziploading = false;
          if (response.status == 1) {
            if (response.data.is_serviceable == 1 && response.data.active_status == 1) {
              this.validZip = true;
              this.stepTwoForm.patchValue({
                propertyState: response.data.state,
                propertyCity: response.data.city
              });
              this.formValidationService.forms();
            } else {
              this.validZipMessage = 'Unavailable services in this zip code';
            }
          } else {
            this.validZipMessage = response.message;
            this.stepTwoForm.patchValue({
              propertyState: '',
              propertyCity: ''
            });
          }
        },
        error: (er) => {
          this.loading = false;
          this.ziploading = false;
        },
        complete: () => {
          if (!this.validZip) {
            this.stepTwoForm.patchValue({
              propertyState: '',
              propertyCity: ''
            });
          }
          this.loading = false;
          this.ziploading = false;
        }
      });
    } else {
      this.validZipMessage = '';
      this.stepTwoForm.patchValue({
        propertyState: '',
        propertyCity: ''
      });
    }
  }

  chekcBillingZipCode(ev: any) {
    if (ev.target.value.length > 4) {
      this.validBillingZip = false;
      this.validBillingZipMessage = '';
      this.apiService.post(AppConfig.apiUrl.common.locationByZip, { zip: ev.target.value.toString() }).subscribe({
        next: (response: any) => {
          if (response.status == 1) {
            if (response.data.is_serviceable == 1 && response.data.active_status == 1) {
              this.validBillingZip = true;
              this.stepFourForm.patchValue({
                billingState: response.data.state,
                billingCity: response.data.city
              });
              this.formValidationService.forms();
            } else {
              this.validBillingZipMessage = 'Unavailable services in this zip code';
            }
            setTimeout(() => {
              this.formValidationService.forms();
            }, 400);
          } else {
            this.validBillingZipMessage = response.message;
            this.stepFourForm.patchValue({
              billingState: '',
              billingCity: ''
            });
          }
        },
        error: (er) => {
          this.loading = false;
        },
        complete: () => {
          if (!this.validBillingZip) {
            this.stepFourForm.patchValue({
              billingState: '',
              billingCity: ''
            });
          }
          this.loading = false;
        }
      });
    } else {
      this.validBillingZipMessage = '';
      this.stepFourForm.patchValue({
        billingState: '',
        billingCity: ''
      });
    }
  }

  stepBack() {
    this.stepper.previous();
  }

  changePhoneFormat(e: any) {
    this.stepOneForm.controls['mobileNo'].setValue(this.commonSvc.setUSFormatPhoneNumber(e.target.value.toString()));
  }



  planSelection(obj: any) {
    this.selectedPlanPrice = 0;
    this.totalAddonProductPrice = 0;
    // this.optionalPlan.nativeElement.scrollIntoView({ behavior: 'smooth', })

    this.planList.forEach((plan: any, index: number) => {
      plan.is_active = false;
      if (plan.plan_id == obj.plan_id) {
        plan.is_active = true;
        plan.plan_term.forEach((term: any) => {
          if (this.planTerm) {
            if (term.plan_term_month == 12 && plan.plan_id == term.plan_id && this.s2['propertyTypeId'].value == term.property_type_id && this.s2['propertySizeId'].value == 1) {
              this.selectedPlanPrice = term.price_above_5000_sqft;
              this.planTermsId = term.plan_terms_id;
            }
            if (term.plan_term_month == 12 && plan.plan_id == term.plan_id && this.s2['propertyTypeId'].value == term.property_type_id && this.s2['propertySizeId'].value == 0) {
              this.selectedPlanPrice = term.price_below_5000_sqft;
              this.planTermsId = term.plan_terms_id;
            }
          } else {
            if (term.plan_term_month == 1 && plan.plan_id == term.plan_id && this.s2['propertyTypeId'].value == term.property_type_id && this.s2['propertySizeId'].value == 1) {
              this.selectedPlanPrice = term.price_above_5000_sqft;
              this.planTermsId = term.plan_terms_id;
            }
            if (term.plan_term_month == 1 && plan.plan_id == term.plan_id && this.s2['propertyTypeId'].value == term.property_type_id && this.s2['propertySizeId'].value == 0) {
              this.selectedPlanPrice = term.price_below_5000_sqft;
              this.planTermsId = term.plan_terms_id;
            }
          }
        });
      }
    });
    let activePlan = _.filter(this.planList, { 'is_active': true });
    this.activePlan = activePlan[0];
    this.calculateAllAddonProductPrice();
  }

  onStepChanged(ev: any) {
    console.log('ev', ev);
    this.currentStep = ev.selectedIndex;
    if (ev.selectedIndex > 0) {
      this.stepperBackBtn = true;
    } else {
      this.stepperBackBtn = false;
    }

    if (ev.selectedIndex == 2 && ev.previouslySelectedIndex == 1) {
      if (this.s2['propertySizeId'].value) {
        this.planList.forEach((plan: any, index: number) => {
          plan.plan_term.forEach((term: any) => {
            if (term.plan_term_month == (this.planTerm ? 12 : 1) && plan.plan_id == term.plan_id && this.s2['propertyTypeId'].value == term.property_type_id) {
              plan.price_above_5000_sqft = term.price_above_5000_sqft;
              plan.price_below_5000_sqft = term.price_below_5000_sqft;
              this.planTermsId = term.plan_terms_id;
            }
          });

        });
      }
    }

    if (ev.selectedIndex == 3 && ev.previouslySelectedIndex == 2) {
      this.changePlanTerm();
      this.currenctPaymentType = 1;
      this.stepFourForm.controls['bankAccountHolderName'].clearValidators();
      this.stepFourForm.controls['bankAccountNumber'].clearValidators();
      this.stepFourForm.controls['routingNumber'].clearValidators();
      this.stepFourForm.controls['bankAccountHolderName'].updateValueAndValidity();
      this.stepFourForm.controls['bankAccountNumber'].updateValueAndValidity();
      this.stepFourForm.controls['routingNumber'].updateValueAndValidity();
    }
    window.scrollTo(0, 0);
  }

  changePlanTerm() {
    if (this.planTerm) {
      this.planTermSelection = 12
    } else {
      this.planTermSelection = 1;
    }

    if (this.s2['propertySizeId'].value) {
      this.planList.forEach((plan: any) => {
        if (plan.is_active) {
          plan.plan_term.some((term: any) => {
            if (this.planTerm) {
              if (term.plan_term_month == 12 && this.activePlan.plan_id == term.plan_id && this.s2['propertyTypeId'].value == term.property_type_id && this.s2['propertySizeId'].value == 1) {
                this.selectedPlanPrice = term.price_above_5000_sqft;
                plan.price_above_5000_sqft = term.price_above_5000_sqft;
                this.planTermsId = term.plan_terms_id;
                return true; // this will break out of the loop
              }
              if (term.plan_term_month == 12 && this.activePlan.plan_id == term.plan_id && this.s2['propertyTypeId'].value == term.property_type_id && this.s2['propertySizeId'].value == 0) {
                this.selectedPlanPrice = term.price_below_5000_sqft;
                plan.price_below_5000_sqft = term.price_below_5000_sqft;
                this.planTermsId = term.plan_terms_id;
                return true; // this will break out of the loop
              }
            } else {
              if (term.plan_term_month == 1 && this.activePlan.plan_id == term.plan_id && this.s2['propertyTypeId'].value == term.property_type_id && this.s2['propertySizeId'].value == 1) {
                this.selectedPlanPrice = term.price_above_5000_sqft;
                plan.price_above_5000_sqft = term.price_above_5000_sqft;
                this.planTermsId = term.plan_terms_id;
                return true; // this will break out of the loop
              }
              if (term.plan_term_month == 1 && this.activePlan.plan_id == term.plan_id && this.s2['propertyTypeId'].value == term.property_type_id && this.s2['propertySizeId'].value == 0) {
                this.selectedPlanPrice = term.price_below_5000_sqft;
                plan.price_below_5000_sqft = term.price_below_5000_sqft;
                this.planTermsId = term.plan_terms_id;
                return true; // this will break out of the loop
              }
            }
            return false; // continue iterating
          });
        } else {
          plan.plan_term.some((term: any) => {
            if (this.planTerm) {
              if (term.plan_term_month == 12 && plan.plan_id == term.plan_id && this.s2['propertyTypeId'].value == term.property_type_id) {
                plan.price_above_5000_sqft = term.price_above_5000_sqft;
                plan.price_below_5000_sqft = term.price_below_5000_sqft;
                this.planTermsId = term.plan_terms_id;
                return;

              }
            } else {
              if (term.plan_term_month == 1 && plan.plan_id == term.plan_id && this.s2['propertyTypeId'].value == term.property_type_id) {
                plan.price_above_5000_sqft = term.price_above_5000_sqft;
                plan.price_below_5000_sqft = term.price_below_5000_sqft;
                this.planTermsId = term.plan_terms_id;
                return;
              }
            }
          });
        }
      });

    }

    this.calculateAllAddonProductPrice();
  }

  changePolicyTerm() {
    if (this.planTermSelection == 1) {
      this.planTerm = false;
      let ccTab: any = document.getElementsByClassName('credit-card');
      ccTab[0].click();
    } else {
      this.planTerm = true;
    }

    if (this.s2['propertySizeId'].value) {
      this.planList.some((plan: any) => {
        if (plan.is_active) {
          return plan.plan_term.some((term: any) => {
            if (term.plan_term_month == this.planTermSelection && this.activePlan.plan_id == term.plan_id && this.s2['propertyTypeId'].value == term.property_type_id && this.s2['propertySizeId'].value == 1) {
              this.selectedPlanPrice = term.price_above_5000_sqft;
              this.planTermsId = term.plan_terms_id;
              this.totalPolicyTerm = term.plan_term.toLowerCase();
              return true; // terminate the loop
            }
            if (term.plan_term_month == this.planTermSelection && this.activePlan.plan_id == term.plan_id && this.s2['propertyTypeId'].value == term.property_type_id && this.s2['propertySizeId'].value == 0) {
              this.selectedPlanPrice = term.price_below_5000_sqft;
              this.planTermsId = term.plan_terms_id;
              this.totalPolicyTerm = term.plan_term.toLowerCase();
              return true; // terminate the loop
            }
            return false;
          });
        } else {
          plan.plan_term.some((term: any) => {
            if (this.planTermSelection) {
              if (term.plan_term_month == this.planTermSelection && plan.plan_id == term.plan_id && this.s2['propertyTypeId'].value == term.property_type_id) {
                plan.price_above_5000_sqft = term.price_above_5000_sqft;
                plan.price_below_5000_sqft = term.price_below_5000_sqft;
                this.planTermsId = term.plan_terms_id;
              }
            }

          });
        }
      });

    }
    this.calculateAllAddonProductPrice();
  }

  getSelectedPropertyText() {
    let selectElement: any = document.getElementById('propertyType');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    this.propertyTypeText = selectedOption.text;
  }

  async stepOneSubmit() {
    console.log(this.stepOneForm);
    this.stepOneSubmitted = true
    if (!this.stepOneForm.valid) {
      this.formValidationService.validateAllFormFields(this.stepOneForm);
      return
    }
    let postData = this.stepOneForm.value;
    postData.session_id = localStorage.getItem('session_id');
    postData.mobileNo = this.commonSvc.convertToNormalPhoneNumber(postData.mobileNo);
    postData.step = 2;
    let leadData = await this.updateLeadInVanillaSoft(postData);
    postData.lead_data = leadData
    this.loading = true;
    const token = await this.recaptchaV3Service.execute('submitStepOneFromFunnel').toPromise();
    let res: any = await this.commonSvc.verifyreCaptcha(token);
    if (res.status == 1) {
      this.apiService.post(`${AppConfig.apiUrl.lead.createUpdateLead}`, postData).subscribe({
        next: (response: any) => {
          this.loading = false;
          if (response.status == 1) {
            window.scrollTo(0, 0);
            setTimeout(() => {
              this.leadId = response.data.lead_id;
              this.leadDetails = response.data;

              localStorage.setItem('lead_id', response.data.lead_id);
              localStorage.setItem('session_id', response.data.session_id);
              localStorage.setItem('lead_user_id', response.data.lead_user_id);
              localStorage.setItem('lead_obj', JSON.stringify(response.data.lead_data));
              localStorage.setItem('email', this.s1['emailId'].value),
                localStorage.setItem('mobile', this.s1['mobileNo'].value);

              let input: any = document.getElementById("addressBar");
              const autocomplete = new google.maps.places.Autocomplete(input, this.options);
              autocomplete.addListener("place_changed", () => {
                this.stepTwoForm.patchValue({
                  propertyAddressOne: input.value,
                })
                const place = autocomplete.getPlace();
                var zipCode = this.getZipCodeFromPlace(place);
                console.log('zipCode', zipCode);

                if (zipCode) {
                  this.stepTwoForm.patchValue({
                    propertyZipCode: zipCode,
                  })
                  let zipData: any = {
                    target: {
                      value: zipCode
                    }
                  }
                  this.chekcZipCode(zipData);
                }
              });
            }, 500);
            localStorage.setItem('lead_obj', JSON.stringify(response.data.lead_data));
            this.stepper.next();
          } else {
            this.alertService.error(response.message);
          }
        },
        error: () => { this.loading = false; },
        complete: () => { this.loading = false; }
      });
    } else {
      this.stepper.previous();
    }
  }

  getZipCodeFromPlace(place: any) {
    for (var i = 0; i < place.address_components.length; i++) {
      for (var j = 0; j < place.address_components[i].types.length; j++) {
        if (place.address_components[i].types[j] == "postal_code") {
          return place.address_components[i].long_name;

        }
      }
    }
    return null;
  }

  async stepTwoSubmit() {
    console.log(this.stepTwoForm);
    this.stepTwoSubmitted = true

    if (!this.stepTwoForm.valid) {
      this.formValidationService.validateAllFormFields(this.stepTwoForm);
      return
    }
    let postData = this.stepTwoForm.value;
    postData.session_id = localStorage.getItem('session_id');
    postData.emailId = this.leadDetails.email;
    postData.mobileNo = this.commonSvc.convertToNormalPhoneNumber(this.leadDetails.mobile);
    postData.propertyType = this.propertyTypeText;
    postData.propertySize = this.s2['propertySizeId'].value == 0 ? 'Under 5,000 sq. ft' : 'Over 5,000 sq. ft'
    postData.step = 3;
    let leadData = await this.updateLeadInVanillaSoft(postData);
    postData.lead_data = leadData
    this.loading2 = true;
    const token = await this.recaptchaV3Service.execute('submitStepTwoFromFunnel').toPromise();
    let res: any = await this.commonSvc.verifyreCaptcha(token);
    if (res.status == 1) {

      this.apiService.post(`${AppConfig.apiUrl.lead.createUpdateLead}`, postData).subscribe({
        next: (response: any) => {
          if (response.status == 1) {
            this.loading2 = false;
            localStorage.setItem('lead_obj', JSON.stringify(response.data.lead_data));
            setTimeout(() => {
              this.leadId = response.data.lead_id;
              this.leadDetails = response.data;
            }, 500);
            this.stepper.next();
            window.scrollTo(0, 0);
            if (this.activePlan) {
              this.planSelection(this.activePlan);
              this.calculateAllAddonProductPrice();
            }
          } else {
            this.alertService.error(response.message);
          }
        },
        error: () => { this.loading2 = false; },
        complete: () => { this.loading2 = false; }
      });
    } else {
      this.stepper.previous();
    }
  }

  openTab(evt: any, tabName: any) {
    var i, tabContent: any, tabLinks;

    // Hide all tab content
    tabContent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabContent.length; i++) {
      tabContent[i].style.display = "none";
    }

    // Deactivate all tab links
    tabLinks = document.getElementsByClassName("tab");
    for (i = 0; i < tabLinks.length; i++) {
      tabLinks[i].classList.remove("active");
    }

    // Show the selected tab content and mark the clicked tab as active
    let el: any = document.getElementById(tabName)
    el.style.display = "block";
    evt.currentTarget.classList.add("active");
    if (tabName == 'tab1') {
      this.currenctPaymentType = 1;
      this.stepFourForm.controls['cardHolderName'].setValidators([Validators.required])
      this.stepFourForm.controls['cardNumber'].setValidators([Validators.required]);
      this.stepFourForm.controls['expiryDate'].setValidators([Validators.required, this.formValidationService.validateExpirationDateFormat, this.formValidationService.expiryDateValidator]);
      this.stepFourForm.controls['cvv'].setValidators([Validators.required, this.formValidationService.validateCVV]);
      this.stepFourForm.controls['cardHolderName'].updateValueAndValidity();
      this.stepFourForm.controls['cardNumber'].updateValueAndValidity();
      this.stepFourForm.controls['expiryDate'].updateValueAndValidity();
      this.stepFourForm.controls['cvv'].updateValueAndValidity();

      this.stepFourForm.controls['bankAccountHolderName'].clearValidators();
      this.stepFourForm.controls['bankAccountNumber'].clearValidators();
      this.stepFourForm.controls['routingNumber'].clearValidators();
      this.stepFourForm.controls['bankAccountHolderName'].updateValueAndValidity();
      this.stepFourForm.controls['bankAccountNumber'].updateValueAndValidity();
      this.stepFourForm.controls['routingNumber'].updateValueAndValidity();

    } else if (tabName == 'tab2') {
      this.currenctPaymentType = 2;

      this.stepFourForm.controls['bankAccountHolderName'].setValidators([Validators.required, this.formValidationService.notEmpty])
      this.stepFourForm.controls['bankAccountNumber'].setValidators([Validators.required]);
      this.stepFourForm.controls['routingNumber'].setValidators([Validators.required]);
      this.stepFourForm.controls['bankAccountHolderName'].updateValueAndValidity();
      this.stepFourForm.controls['bankAccountNumber'].updateValueAndValidity();
      this.stepFourForm.controls['routingNumber'].updateValueAndValidity();


      this.stepFourForm.controls['cardHolderName'].clearValidators();
      this.stepFourForm.controls['cardNumber'].clearValidators();
      this.stepFourForm.controls['expiryDate'].clearValidators();
      this.stepFourForm.controls['cvv'].clearValidators();
      this.stepFourForm.controls['cardHolderName'].updateValueAndValidity();
      this.stepFourForm.controls['cardNumber'].updateValueAndValidity();
      this.stepFourForm.controls['expiryDate'].updateValueAndValidity();
      this.stepFourForm.controls['cvv'].updateValueAndValidity();
    } else {
      this.stepFourForm.controls['bankAccountHolderName'].clearValidators();
      this.stepFourForm.controls['bankAccountNumber'].clearValidators();
      this.stepFourForm.controls['routingNumber'].clearValidators();
      this.stepFourForm.controls['bankAccountHolderName'].updateValueAndValidity();
      this.stepFourForm.controls['bankAccountNumber'].updateValueAndValidity();
      this.stepFourForm.controls['routingNumber'].updateValueAndValidity();
      this.stepFourForm.controls['cardHolderName'].clearValidators();
      this.stepFourForm.controls['cardNumber'].clearValidators();
      this.stepFourForm.controls['expiryDate'].clearValidators();
      this.stepFourForm.controls['cvv'].clearValidators();
      this.stepFourForm.controls['cardHolderName'].updateValueAndValidity();
      this.stepFourForm.controls['cardNumber'].updateValueAndValidity();
      this.stepFourForm.controls['expiryDate'].updateValueAndValidity();
      this.stepFourForm.controls['cvv'].updateValueAndValidity();
      this.currenctPaymentType = 3;
    }

  }

  setSamePropertyAddress() {
    if (this.isSamePropertyAddress) {
      this.stepFourForm.patchValue({
        billingAddress: this.s2['propertyAddressOne'].value,
        billingZipCode: this.s2['propertyZipCode'].value,
        billingState: this.s2['propertyState'].value,
        billingCity: this.s2['propertyCity'].value
      })
      this.validBillingZip = this.validZip;
    } else {
      this.stepFourForm.patchValue({
        billingAddress: '',
        billingZipCode: null,
        billingState: '',
        billingCity: ''
      })
    }
    setTimeout(() => {
      this.formValidationService.forms();
    }, 250);
  }

  changeBillingAddress() {
    this.isSamePropertyAddress = false;
  }

  disableClick() {
    if (!this.activePlan) {
      this.alertService.error('Please select plan');
    } else {
      if (Object.keys(this.activePlan).length == 0) {
        this.alertService.error('Please select plan');
      }
    }
  }

  addonProductSelection(ev: any, obj: any) {
    if (obj.is_selected) {
      this.selectdAddOnProducts.push(obj)
    } else {
      _.remove(this.selectdAddOnProducts, { 'product_id': obj.product_id });
    }
    this.calculateAllAddonProductPrice();
  }

  calculateAllAddonProductPrice() {
    if (this.planTermSelection > 1) {
      this.totalAddonProductPrice = this.selectdAddOnProducts.reduce((accumulator: number, currentValue: any) => {
        return accumulator + currentValue.yearly_price * (this.planTermSelection / 12);
      }, 0);
      this.totalAddonProductPrice = this.totalAddonProductPrice;
    } else {
      this.totalAddonProductPrice = this.selectdAddOnProducts.reduce((accumulator: number, currentValue: any) => {
        return accumulator + currentValue.monthly_price;
      }, 0);
    }
  }

  async goToStepFour() {
    this.policyTerm = [];
    this.stepper.next();
    this.totalPolicyTerm = this.planTerm ? '1 Year' : 'Monthly';
    if (this.planTerm) {
      this.planTermSelection = 12;
    } else {
      this.planTermSelection = 1;
    }
    let postData: any = {};
    postData.step = 4;
    let addOnProducts: any = []
    this.selectdAddOnProducts.forEach((element: any) => {
      addOnProducts.push(element.product_name);
    });
    let activePlan = _.filter(this.planList, { 'is_active': true });
    this.activePlan = activePlan[0];
    postData.planId = this.activePlan.plan_id;
    postData.addOnCoverages = addOnProducts.join(',');
    postData.price = this.selectedPlanPrice + this.totalAddonProductPrice;
    postData.planName = this.activePlan.plan_name;
    postData.policyTerm = this.totalPolicyTerm;
    postData.session_id = localStorage.getItem('session_id');
    postData.emailId = this.leadDetails.email;
    postData.mobileNo = this.commonSvc.convertToNormalPhoneNumber(this.leadDetails.mobile);
    postData.leadId = this.leadId;
    let leadData = await this.updateLeadInVanillaSoft(postData);
    postData.lead_data = leadData
    const token = await this.recaptchaV3Service.execute('submitStepThreeFromFunnel').toPromise();
    let res: any = await this.commonSvc.verifyreCaptcha(token);
    if (res.status == 1) {
      this.apiService.post(`${AppConfig.apiUrl.lead.createUpdateLead}`, postData).subscribe({
        next: (response: any) => {
          console.log('response', response);
          if (response.status == 1) {
            localStorage.setItem('lead_obj', JSON.stringify(response.data.lead_data));
            let input: any = document.getElementById("addressBar2");
            const autocomplete = new google.maps.places.Autocomplete(input, this.options);
            autocomplete.addListener("place_changed", () => {
              this.stepFourForm.patchValue({
                billingAddress: input.value,
              })
              const place = autocomplete.getPlace();
              var zipCode = this.getZipCodeFromPlace(place);
              console.log('zipCode', zipCode);

              if (zipCode) {
                this.stepFourForm.patchValue({
                  billingZipCode: zipCode,
                })
                let zipData: any = {
                  target: {
                    value: zipCode
                  }
                }

                this.chekcBillingZipCode(zipData);
              }
            });

            this.stepper.next();
            this.leadDetails = response.data;
            for (let objData in this.groupedData) {
              let filteredData = _.filter(this.groupedData[objData], { 'plan_id': this.activePlan.plan_id, 'property_type_id': this.s2['propertyTypeId'].value })
              if (filteredData.length > 0) {
                this.groupedData[objData] = filteredData;
              }
            }

            // Convert the groupedData object back to an array
            const groupedArray = Object.keys(this.groupedData).map((month) => ({
              plan_term_month: parseInt(month, 10), // Convert back to a number
              plan_term: this.groupedData[month][0].plan_term
              // data: groupedData[month], // The array of items for this month
            }));
            this.policyTerm = groupedArray;

            console.log('policyTerm', this.policyTerm);
            window.scrollTo(0, 0);
            this.changePolicyTerm();
          } else {
            this.alertService.error(response.message);
          }
        },
        error: () => { this.loading = false; },
        complete: () => { this.loading = false; }
      });
    } else {
      this.stepper.previous();
    }
  }

  toggleAddonItem() {
    this.showAddonItem = !this.showAddonItem;
  }

  showMore(obj: any) {
    obj.showMoreItem = !obj.showMoreItem;
    if (obj.showMoreItem) {
      obj.displayedItems = this.planWiseProductList.length;
      this.isExpanded = true
    } else {
      obj.displayedItems = 12;
      this.isExpanded = false
    }
    if (this.showMoreItemAddon) {
      this.isExpanded = true;
    } else {
      this.isExpanded = false;
    }
    this.planList.forEach((obj: any) => {
      if (obj.showMoreItem) {
        this.isExpanded = true;
      }
    });

  }

  showMoreAddon() {
    this.showMoreItemAddon = !this.showMoreItemAddon
    if (this.showMoreItemAddon) {
      this.displayedAddonItems = this.addOnProductList.length;
      this.isExpanded = true;
    } else {
      this.displayedAddonItems = 14;
      this.isExpanded = false;
    }
    this.planList.forEach((obj: any) => {
      if (obj.showMoreItem) {
        this.isExpanded = true;
      }
    });
  }


  async stepFourSubmit() {
    this.stepFourSubmitted = true
    if (!this.stepFourForm.valid || !this.validBillingZip) {
      this.formValidationService.validateAllFormFields(this.stepFourForm);
      let firstInvalidControl = this.stepFour.nativeElement.getElementsByClassName('ng-invalid')[0];
      const rect = firstInvalidControl.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // Calculate the scroll position relative to the document
      const scrollPosition = rect.top + scrollTop + 150;
      window.scrollTo({ top: Math.abs(rect.top), behavior: 'smooth' });
      //  (firstInvalidControl as HTMLElement).focus();
      return
    }
    let termObj: any = {}
    this.activePlan.plan_term.forEach((term: any) => {
      if (term.plan_term.toLowerCase() == this.totalPolicyTerm.toLowerCase()) {
        termObj = term;
      }
    });
    let postData: any = {};
    postData.firstName = this.s1['firstName'].value;
    postData.lastName = this.s1['lastName'].value;
    postData.emailId = this.s1['emailId'].value;
    postData.mobileNo = this.commonSvc.convertToNormalPhoneNumber(this.s1['mobileNo'].value);
    postData.billingAddress = this.s4['billingAddress'].value;
    postData.billingZipCode = this.s4['billingZipCode'].value;
    postData.billingState = this.s4['billingState'].value;
    postData.billingCity = this.s4['billingCity'].value;

    postData.zipCode = this.s2['propertyZipCode'].value;
    postData.state = this.s2['propertyState'].value;
    postData.city = this.s2['propertyCity'].value;
    postData.planName = this.activePlan.plan_name
    postData.address1 = this.s2['propertyAddressOne'].value;
    postData.planId = this.activePlan.plan_id
    postData.leadId = this.leadId;
    postData.policyTerm = this.totalPolicyTerm;
    postData.policyTermMonth = this.planTermSelection;
    postData.planTermId = this.planTermsId;
    postData.propertyType = this.s2['propertyTypeId'].value;
    postData.propertySize = this.s2['propertySizeId'].value;
    postData.bonusMonth = termObj.bonus_month
    postData.policyAmount = parseFloat(Number(this.selectedPlanPrice).toFixed(2));
    postData.addonCoverageAmount = parseFloat(Number(this.totalAddonProductPrice).toFixed(2));
    postData.subTotalAmount = parseFloat(Number(this.selectedPlanPrice + this.totalAddonProductPrice).toFixed(2));
    postData.surchargeAmount = 0;
    postData.totalPrice = parseFloat(Number(this.selectedPlanPrice + this.totalAddonProductPrice).toFixed(2));
    postData.taxAmount = 0;
    postData.discountAmount = 0;
    postData.selectdAddOnProducts = this.selectdAddOnProducts;
    postData.netAmount = parseFloat(Number((this.selectedPlanPrice + this.totalAddonProductPrice + postData.surchargeAmount) - postData.discountAmount).toFixed(2));
    postData.couponCode = '';
    postData.pcfAmount = this.planTermSelection > 12 ? 65 : 75;
    postData.createUserType = 1;
    postData.paymentType = this.currenctPaymentType;
    postData.cardHolderName = this.s4['cardHolderName'].value ? this.s4['cardHolderName'].value : null;
    postData.cardNumber = this.s4['cardNumber'].value ? this.s4['cardNumber'].value.replace(/\s/g, "") : null;
    postData.expiryDate = this.s4['expiryDate'].value ? this.s4['expiryDate'].value.replace(/\//g, '') : null;
    postData.cardCode = this.s4['cvv'].value ? this.s4['cvv'].value : null;
    postData.bankAccountHolderName = this.s4['bankAccountHolderName'].value ? this.s4['bankAccountHolderName'].value : null;
    postData.bankAccountNumber = this.s4['bankAccountNumber'].value ? this.s4['bankAccountNumber'].value : null;
    postData.routingNumber = this.s4['routingNumber'].value ? this.s4['routingNumber'].value : null;
    let leadData = await this.updateLeadInVanillaSoft(postData);
    postData.lead_data = leadData
    this.loading = true;
    const token = await this.recaptchaV3Service.execute('submitStepFourFromFunnel').toPromise();
    let res: any = await this.commonSvc.verifyreCaptcha(token);
    if (res.status == 1) {
      this.updateCustomerPolicyAndpayment(postData);
    } else {
      this.loading = false;
    }
    // if (this.currenctPaymentType == 1) {
    //   paymentRes = await this.createCreditCardPayment(postData);
    //   if (paymentRes.response.messages.resultCode != 'Error') {
    //     if (paymentRes.response.transactionResponse.responseCode == '1') {
    //       postData.paymentResponse = paymentRes;

    //     } else {
    //       this.alertService.error(paymentRes.response.transactionResponse.errors.error.errorText);
    //       return;
    //     }
    //   } else {
    //     this.alertService.error(paymentRes.response.messages.message[0].text);
    //     return;
    //   }
    // }

    // if (this.currenctPaymentType == 2) {
    //   paymentRes = await this.createBankPayment(postData);
    //   if (paymentRes.response.messages.resultCode != 'Error') {
    //     if (paymentRes.response.transactionResponse.responseCode == '1') {
    //       postData.paymentResponse = paymentRes;





    //       this.updateCustomerPolicyAndpayment(postData)
    //     } else {
    //       this.alertService.error(paymentRes.response.transactionResponse.errors.error.errorText);
    //       return;
    //     }
    //   } else {
    //     if (!AppConfig.production) {
    //       postData.paymentResponse = paymentRes;
    //       this.updateCustomerPolicyAndpayment(postData)
    //     } else {
    //       this.alertService.error(paymentRes.response.messages.message[0].text);
    //       return;
    //     }
    //   }

    // }

  }

  async createBankPayment(postData: any) {
    try {
      const response = await this.apiService.post(`${AppConfig.apiUrl.payments.bankDebit}`, postData).toPromise();
      return response;
    } catch (error) {
      console.error(error);
      throw error; // Re-throw the error for handling in the calling function.
    }
  }


  async createCreditCardPayment(postData: any) {
    try {
      const response = await this.apiService.post(`${AppConfig.apiUrl.payments.creditCard}`, postData).toPromise();
      return response;
    } catch (error) {
      console.error(error);
      throw error; // Re-throw the error for handling in the calling function.
    }
  }


  updateCustomerPolicyAndpayment(obj: any) {
    this.apiService.post(`${AppConfig.apiUrl.policy.createPolicy}`, obj).subscribe({
      next: (response: any) => {
        console.log('response', response);
        if (response.status == 1) {
          this.loading = false;
          // this.stepper.next();
          // this.alertService.success(response.message);
          localStorage.removeItem('zip');
          localStorage.removeItem('mobile');
          localStorage.removeItem('email');
          window.scrollTo(0, 0);
          this.router.navigate(['/thankyou']);
        } else {
          this.alertService.error(response.message);
        }
      },
      error: () => { this.loading = false; },
      complete: () => { this.loading = false; }
    });
  }

  async updateLeadByField(field: any, ev: any) {
    let leadField = await this.updateLeadFields(field);
    let eventValue = ev.target ? ev.target.value : ev;
    if (leadField == 'policy_term') {
      let term = eventValue > 1 ? eventValue / 12 : 1;
      if (eventValue == 1) {
        eventValue = 'Monthly'
      } else if (eventValue == 12) {
        eventValue = '1 Year'
      } else {
        eventValue = term + ' Years'
      }
    }

    let data: any = {
      [`lead_field_${leadField}`]: eventValue,
      session_id: localStorage.getItem('session_id'),
      mobileNo: this.commonSvc.convertToNormalPhoneNumber(localStorage.getItem('mobile')),
      emailId: localStorage.getItem('email'),
      lead_user_id: localStorage.getItem('lead_user_id'),
 
    }
    let leadData = await this.updateLeadInVanillaSoft(data);
    data.lead_data = leadData
    this.updateFieldSubject.next(data);
  }

  async updateLeadInVanillaSoft(postData: any) {
    let leadData: any = {};
    let leadObj: any = localStorage.getItem('lead_obj');
    leadData = leadObj == null ? {} : JSON.parse(leadObj);
    if (postData['lead_user_id']) {
      leadData['user_id'] = postData['lead_user_id']
    }
    if (postData['policyTerm']) {
      leadData['policy_term'] = `${postData['policyTerm']}`
    }
    if (postData['planName']) {
      leadData['plan_name'] = postData['planName'].trim() == 'Platinum' ? 'Premier Platinum Plan' : 'Premier Plan';
    }
    if (postData['propertyType']) {
      leadData['property_type'] = postData['propertyType']
    }
    if (postData['propertySize']) {
      leadData['property_size'] = postData['propertySize']
    }
    if (postData['addOnCoverages']) {
      leadData['optional_coverage'] = postData['addOnCoverages']
    }

    if (postData['price']) {
      leadData['price'] = postData['price']
    }
    if (postData['propertyAddressOne']) {
      leadData['address_1'] = postData['propertyAddressOne'];
    }

    if (postData['policyTerm']) {
      leadData['policy_term'] = postData['policyTerm'];
    }

    if (postData['propertyCity']) {
      leadData['city'] = postData['propertyCity']
    }
    if (postData['propertyState']) {
      leadData['state'] = postData['propertyState']
    }
    if (postData['propertyZipCode']) {
      leadData['zipcode'] = postData['propertyZipCode']
    }
    if (postData['emailId']) {
      leadData['email'] = postData['emailId']
    }
    if (postData['firstName']) {
      leadData['first_name'] = postData['firstName']
    }
    if (postData['lastName']) {
      leadData['last_name'] = postData['lastName']
    }
    if (postData['mobileNo']) {
      leadData['mobile'] = postData['mobileNo']
    }


    const leadField = Object.keys(postData).filter((key) => key.startsWith('lead_field_'));
    if (leadField[0]) {
      let actualLeadField = leadField[0].replace(/lead_field_/, '')

      if (actualLeadField == 'property_address1') {
        leadData['address_1'] = postData[leadField[0]]
      }
      if (actualLeadField == 'policy_term') {
        leadData['policy_term'] = postData[leadField[0]]
      }
    }

    leadData['UTMID'] = this.utmId ? this.utmId : '';
    leadData['lead_source'] = 'Web Search';
    leadData['clickid'] = this.clickId ? this.clickId : '';
    // console.log('leadData', leadData);
    return leadData
  }

  async updateLeadFields(field: any) {    
    if (field == 'policyTerm') {
      field = 'policy_term'
    }
    return field
  }

  ngOnDestroy() {
    localStorage.removeItem('zip');
  }


}


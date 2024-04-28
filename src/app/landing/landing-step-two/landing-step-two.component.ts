import { Component, HostListener, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/@core/services/alert.service';
import { ApiService } from 'src/app/@core/services/api.service';
import { CommonService } from 'src/app/@core/services/common.service';
import { FormValidationService } from 'src/app/@core/services/form-validation.service';
import { AppConfig } from 'src/app/@utils/const/app.config';
import { CdkStepper } from '@angular/cdk/stepper';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import * as _ from "lodash";
import * as moment from 'moment';
declare var google: any;
@Component({
  selector: 'app-landing-step-two',
  templateUrl: './landing-step-two.component.html',
  styleUrls: ['./landing-step-two.component.scss']
})
export class LandingStepTwoComponent {
  @ViewChild(CdkStepper) stepper!: CdkStepper;
  public loading: boolean = false;
  public stepTwoForm!: FormGroup;
  public stepThreeForm!: FormGroup;
  public planList: any = [];
  public addOnProductList: any[] = [];
  public planWiseProductList: any[] = [];
  public selectedPlanPrice: number = 0;
  public totalAddonProductPrice: number = 0;
  public planTerm: boolean = true;
  public totalPolicyTerm: any = '';
  public planTermsId: any = '';
  public activePlan: any = {};
  public policyTerm: any = [];
  public planTermSelection: any = 12;
  public selectdAddOnProducts: any = [];
  public showMoreItemAddon: boolean = false;
  public isExpanded: boolean = false;
  public displayedAddonItems: number = 14;
  public propertySizeId: number = 0;
  public propertyTypeId: number = 1;

  public propertyTypes: any = [];
  public propertyTypeText: any = '';
  public validZip: boolean = true;
  public validBillingZip: boolean = false;
  public leadDetails: any = {};
  public stepThreeSubmitted: boolean = false;
  public isSamePropertyAddress: boolean = false;
  public validZipMessage: any = '';
  public validBillingZipMessage: any = '';
  public currenctPaymentType: number = 1;
  public groupedData: any = [];
  public termsCondition: boolean = false;

  public isFourthStep: boolean = false;
  public enableBackToFirstStep: boolean = false;
  public enableBackToSecondStep: boolean = false;
  public showArrow: boolean = false;
  public currectYear: any = '';
  public selectedPropertyType: any = '';

  private updateFieldSubject = new Subject<any>();
  private updateFieldSubscription!: Subscription;

  options = {
    types: ["address"],
    componentRestrictions: {
      country: 'us'
    }

  };
  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private formValidationService: FormValidationService,
    private apiService: ApiService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private router: Router,
    private commonSvc: CommonService,
  ) {

    this.commonSvc.setTitle('First Premier Home Warranty: Checkout');
    this.stepTwoForm = this.fb.group({
      selectedPlanField: ['', [Validators.required]],
    });
    this.stepThreeForm = this.fb.group({
      propertyTypeId: [''],
      propertySizeId: [''],
      propertyAddressOne: ['', [Validators.required, this.formValidationService.notEmpty]],
      propertyZipCode: ['', [Validators.required, this.formValidationService.numericOnly]],
      propertyCity: [''],
      propertyState: [''],
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
  }
  ngOnInit(): void {
    this.enableBackToFirstStep = true;
    this.getAllPlans();
    this.getAllAddonProducts();

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
    if (localStorage.getItem('lead_id') == null) {
      this.router.navigate(['/home-warranty-quotes']);
      return;
    }
    this.currectYear = moment().format('YYYY');
    this.stepper.next();
    window.scrollTo(0, 0);
    this.getLeadDetailsByLeadId();
    this.getAllPropertyTypes();
    this.getAllPolicyTerms();

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

  get s3() { return this.stepThreeForm.controls; }

  @HostListener('window:scroll', ['$event']) onScroll($event: Event): void {
    if ($event) {
      if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
      ) {
        this.showArrow = true;
      } else {
        this.showArrow = false;
      }
    }
  }

  getLeadDetailsByLeadId() {
    let data = {
      lead_id: localStorage.getItem('lead_id')

    }
    this.apiService.post(AppConfig.apiUrl.lead.getLeadDetailsByEmailAndSessionId, data).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          this.leadDetails = response.data;
        } else {
          this.alertService.error(response.message);
        }
      }
    });
  }

  getSelectedPropertyText() {
    let selectElement: any = document.getElementById('propertyType');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    this.propertyTypeText = selectedOption.text;
    this.changePolicyTerm()
  }

  getAllPropertyTypes() {
    this.apiService.get(`${AppConfig.apiUrl.common.getAllpropertyTypes}`).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          this.propertyTypes = response.data;
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

  getAllPlans() {
    this.apiService.get(`${AppConfig.apiUrl.common.getAllPlans}?active_status=1`).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          response.data.forEach((element: any) => {
            // if (element.plan_name.toLowerCase() == 'platinum' || element.plan_name.toLowerCase() == 'premier') {

            // }
            if (element.plan_id == 2) {
              this.activePlan = element;
              element.is_active = true;
            }
            element.displayedItems = 12;
            this.planList.push(element)
          });
          this.planList.forEach((element: any) => {

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
          this.changePlanTerm();
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
        } else {
          this.alertService.error(response.message);
        }
      }
    });
  }

  scrollToTop() {
    window.scroll({ top: 0, behavior: "smooth" })
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
            if (term.plan_term_month == 12 && plan.plan_id == term.plan_id && this.propertyTypeId == term.property_type_id && this.propertySizeId == 0) {
              this.selectedPlanPrice = term.price_above_5000_sqft;
              this.planTermsId = term.plan_terms_id;
            }
            if (term.plan_term_month == 12 && plan.plan_id == term.plan_id && this.propertyTypeId == term.property_type_id && this.propertySizeId == 0) {
              this.selectedPlanPrice = term.price_below_5000_sqft;
              this.planTermsId = term.plan_terms_id;
            }
          } else {
            if (term.plan_term_month == 1 && plan.plan_id == term.plan_id && this.propertyTypeId == term.property_type_id && this.propertySizeId == 0) {
              this.selectedPlanPrice = term.price_above_5000_sqft;
              this.planTermsId = term.plan_terms_id;
            }
            if (term.plan_term_month == 1 && plan.plan_id == term.plan_id && this.propertyTypeId == term.property_type_id && this.propertySizeId == 0) {
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

  onStepChanged(ev: any) {
    console.log('ev', ev);
    this.enableBackToFirstStep = false;
    this.enableBackToSecondStep = false;

    if (ev.selectedIndex == 1) {
      this.enableBackToFirstStep = true;
    }
    if (ev.selectedIndex == 2) {
      this.enableBackToSecondStep = true;
      this.stepThreeForm.controls['bankAccountHolderName'].clearValidators();
      this.stepThreeForm.controls['bankAccountNumber'].clearValidators();
      this.stepThreeForm.controls['routingNumber'].clearValidators();
      this.stepThreeForm.controls['bankAccountHolderName'].updateValueAndValidity();
      this.stepThreeForm.controls['bankAccountNumber'].updateValueAndValidity();
      this.stepThreeForm.controls['routingNumber'].updateValueAndValidity();
    }



  }

  changePlanTerm() {
    if (this.planTerm) {
      this.planTermSelection = 12
    } else {
      this.planTermSelection = 1;
    }

    // if (typeof this.propertySizeId !== 'undefined' && this.propertySizeId !== null) {
    this.planList.forEach((plan: any) => {
      if (plan.is_active) {
        plan.plan_term.some((term: any) => {
          if (this.planTerm) {
            // if (term.plan_term_month == this.planTermSelection && this.activePlan.plan_id == term.plan_id && this.propertyTypeId == term.property_type_id && this.propertySizeId == 1) {
            //   this.selectedPlanPrice = term.price_above_5000_sqft;
            //   this.planTermsId = term.plan_terms_id;
            //   return true; // this will break out of the loop
            // }
            if (term.plan_term_month == this.planTermSelection && this.activePlan.plan_id == term.plan_id && this.propertyTypeId == term.property_type_id && this.propertySizeId == 0) {
              this.selectedPlanPrice = term.price_below_5000_sqft;
              plan.price_below_5000_sqft = term.price_below_5000_sqft;
              this.totalPolicyTerm = term.plan_term.toLowerCase();
              this.planTermsId = term.plan_terms_id;
              return true; // this will break out of the loop
            }
          } else {
            // if (term.plan_term_month == this.planTermSelection && this.activePlan.plan_id == term.plan_id && this.propertyTypeId == term.property_type_id && this.propertySizeId == 1) {
            //   this.selectedPlanPrice = term.price_above_5000_sqft;
            //   this.planTermsId = term.plan_terms_id;
            //   return true; // this will break out of the loop
            // }
            if (term.plan_term_month == this.planTermSelection && this.activePlan.plan_id == term.plan_id && this.propertyTypeId == term.property_type_id && this.propertySizeId == 0) {
              this.selectedPlanPrice = term.price_below_5000_sqft;
              plan.price_below_5000_sqft = term.price_below_5000_sqft;
              this.totalPolicyTerm = term.plan_term.toLowerCase();
              this.planTermsId = term.plan_terms_id;
              return true; // this will break out of the loop
            }
          }
          return false; // continue iterating
        });
      } else {
        plan.plan_term.some((term: any) => {
          if (this.planTerm && !this.planTermsId) {
            if (term.plan_term_month == this.planTermSelection && plan.plan_id == term.plan_id && this.propertyTypeId == term.property_type_id && this.propertySizeId == 0) {
              plan.price_above_5000_sqft = term.price_above_5000_sqft;
              plan.price_below_5000_sqft = term.price_below_5000_sqft;
              this.totalPolicyTerm = term.plan_term.toLowerCase();
              // this.planTermsId = term.plan_terms_id;

            }
          } else {
            if (term.plan_term_month == this.planTermSelection && plan.plan_id == term.plan_id && this.propertyTypeId == term.property_type_id && this.propertySizeId == 0) {

              plan.price_above_5000_sqft = term.price_above_5000_sqft;
              plan.price_below_5000_sqft = term.price_below_5000_sqft;
              this.totalPolicyTerm = term.plan_term.toLowerCase();
              //  this.planTermsId = term.plan_terms_id;

            }
          }
        });
      }
    });
    // }

    this.calculateAllAddonProductPrice();
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

  addonProductSelection(ev: any, obj: any) {
    if (obj.is_selected) {
      this.selectdAddOnProducts.push(obj)
    } else {
      _.remove(this.selectdAddOnProducts, { 'product_id': obj.product_id });
    }
    this.calculateAllAddonProductPrice();
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
      this.stepThreeForm.controls['cardHolderName'].setValidators([Validators.required])
      this.stepThreeForm.controls['cardNumber'].setValidators([Validators.required]);
      this.stepThreeForm.controls['expiryDate'].setValidators([Validators.required, this.formValidationService.validateExpirationDateFormat, this.formValidationService.expiryDateValidator]);
      this.stepThreeForm.controls['cvv'].setValidators([Validators.required, this.formValidationService.validateCVV]);
      this.stepThreeForm.controls['cardHolderName'].updateValueAndValidity();
      this.stepThreeForm.controls['cardNumber'].updateValueAndValidity();
      this.stepThreeForm.controls['expiryDate'].updateValueAndValidity();
      this.stepThreeForm.controls['cvv'].updateValueAndValidity();

      this.stepThreeForm.controls['bankAccountHolderName'].clearValidators();
      this.stepThreeForm.controls['bankAccountNumber'].clearValidators();
      this.stepThreeForm.controls['routingNumber'].clearValidators();
      this.stepThreeForm.controls['bankAccountHolderName'].updateValueAndValidity();
      this.stepThreeForm.controls['bankAccountNumber'].updateValueAndValidity();
      this.stepThreeForm.controls['routingNumber'].updateValueAndValidity();

    } else if (tabName == 'tab2') {
      this.currenctPaymentType = 2;

      this.stepThreeForm.controls['bankAccountHolderName'].setValidators([Validators.required, this.formValidationService.notEmpty])
      this.stepThreeForm.controls['bankAccountNumber'].setValidators([Validators.required]);
      this.stepThreeForm.controls['routingNumber'].setValidators([Validators.required]);
      this.stepThreeForm.controls['bankAccountHolderName'].updateValueAndValidity();
      this.stepThreeForm.controls['bankAccountNumber'].updateValueAndValidity();
      this.stepThreeForm.controls['routingNumber'].updateValueAndValidity();


      this.stepThreeForm.controls['cardHolderName'].clearValidators();
      this.stepThreeForm.controls['cardNumber'].clearValidators();
      this.stepThreeForm.controls['expiryDate'].clearValidators();
      this.stepThreeForm.controls['cvv'].clearValidators();
      this.stepThreeForm.controls['cardHolderName'].updateValueAndValidity();
      this.stepThreeForm.controls['cardNumber'].updateValueAndValidity();
      this.stepThreeForm.controls['expiryDate'].updateValueAndValidity();
      this.stepThreeForm.controls['cvv'].updateValueAndValidity();
    } else {
      this.stepThreeForm.controls['bankAccountHolderName'].clearValidators();
      this.stepThreeForm.controls['bankAccountNumber'].clearValidators();
      this.stepThreeForm.controls['routingNumber'].clearValidators();
      this.stepThreeForm.controls['bankAccountHolderName'].updateValueAndValidity();
      this.stepThreeForm.controls['bankAccountNumber'].updateValueAndValidity();
      this.stepThreeForm.controls['routingNumber'].updateValueAndValidity();
      this.stepThreeForm.controls['cardHolderName'].clearValidators();
      this.stepThreeForm.controls['cardNumber'].clearValidators();
      this.stepThreeForm.controls['expiryDate'].clearValidators();
      this.stepThreeForm.controls['cvv'].clearValidators();
      this.stepThreeForm.controls['cardHolderName'].updateValueAndValidity();
      this.stepThreeForm.controls['cardNumber'].updateValueAndValidity();
      this.stepThreeForm.controls['expiryDate'].updateValueAndValidity();
      this.stepThreeForm.controls['cvv'].updateValueAndValidity();
      this.currenctPaymentType = 3;
    }

  }

  async goToStepThree() {
    this.stepTwoForm.patchValue({
      selectedPlanField: this.activePlan.plan_id
    });

    this.stepThreeForm.patchValue({
      propertySizeId: this.propertySizeId.toString(),
      propertyTypeId: this.propertyTypeId
    })

    this.propertyTypes.forEach((type: any) => {
      if (type.property_type_id == this.s3['propertyTypeId'].value) {
        this.selectedPropertyType = type.property_type;
      }
    });
    let selectedAddonNames: any = [];
    this.selectdAddOnProducts.forEach((prod: any) => {
      selectedAddonNames.push(prod.product_name);
    });

    let postData: any = {
      session_id: localStorage.getItem('session_id'),
      mobileNo: this.commonSvc.convertToNormalPhoneNumber(localStorage.getItem('mobile')),
      lead_id: localStorage.getItem('lead_id'),
      lead_user_id: localStorage.getItem('lead_user_id'),
      emailId: localStorage.getItem('email'),
      planName: this.activePlan.plan_name,
      policyTerm: this.planTerm ? '1 Year' : 'Monthly',
      propertyType: this.selectedPropertyType,
      propertySize: this.propertySizeId == 0 ? 'Under 5,000 sq. ft' : 'Over 5,000 sq. ft',
      addOnCoverages: selectedAddonNames.join(),
      price: (this.selectedPlanPrice + this.totalAddonProductPrice),
      step: 6
    }
    let leadData = await this.updateLeadInVanillaSoft(postData);
    postData.lead_data = leadData
    let updateLead: any = this.createAndUpdateLead(postData);
    if (updateLead) {
      this.stepper.next();
    }

    window.scrollTo(0, 0);
    this.isFourthStep = true;

    this.stepThreeForm.patchValue({
      propertyZipCode: this.leadDetails.property_zip,
      propertyCity: this.leadDetails.property_city,
      propertyState: this.leadDetails.property_state,
    })
    for (let objData in this.groupedData) {
      let filteredData = _.filter(this.groupedData[objData], { 'plan_id': 1, 'property_type_id': 0 })
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



    setTimeout(() => {
      this.formValidationService.forms();
    }, 250);

    let input: any = document.getElementById("addressBar");
    const autocomplete = new google.maps.places.Autocomplete(input, this.options);
    autocomplete.addListener("place_changed", () => {
      this.stepThreeForm.patchValue({
        billingAddress: input.value,
      })
      const place = autocomplete.getPlace();
      var zipCode = this.getZipCodeFromPlace(place);
      console.log('zipCode', zipCode);

      if (zipCode) {
        this.stepThreeForm.patchValue({
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

    let addressInput: any = document.getElementById("propertyAddressBar");
    const propertyautocomplete = new google.maps.places.Autocomplete(addressInput, this.options);
    propertyautocomplete.addListener("place_changed", () => {
      this.stepThreeForm.patchValue({
        propertyAddressOne: addressInput.value,
      })
      const porpertyplace = propertyautocomplete.getPlace();
      var propertyZipCode = this.getZipCodeFromPlace(porpertyplace);
      console.log('propertyZipCode', propertyZipCode);

      if (propertyZipCode) {
        this.stepThreeForm.patchValue({
          propertyZipCode: propertyZipCode,
        })
        let zipData: any = {
          target: {
            value: propertyZipCode
          }
        }
        this.chekcProperZipCode(zipData);
      }
    });
  }

  chekcBillingZipCode(ev: any) {
    if (ev.target.value.length > 4) {
      this.validBillingZip = false;
      this.validBillingZipMessage='';
      console.log(ev.target.value);
      this.apiService.post(AppConfig.apiUrl.common.locationByZip, { zip: ev.target.value.toString() }).subscribe({
        next: (response: any) => {
          if (response.status == 1) {
            if (response.data.is_serviceable == 1 && response.data.active_status == 1) {
              this.validBillingZip = true;
              this.stepThreeForm.patchValue({
                billingState: response.data.state,
                billingCity: response.data.city
              });
              setTimeout(() => {
                this.formValidationService.forms();
              }, 400);
            } else {
              this.validBillingZip = false;
              this.validBillingZipMessage = 'Unavailable services in this zip code';
            }
          } else {
            this.stepThreeForm.patchValue({
              billingState: '',
              billingCity: ''
            });
            this.validBillingZipMessage = response.message;
          }
        },
        error: (er) => {

        },
        complete: () => {
          if (!this.validBillingZip) {
            this.stepThreeForm.patchValue({
              billingState: '',
              billingCity: ''
            });
          }
          setTimeout(() => {
            this.formValidationService.forms();
          }, 400);
        }
      });
    } else {
      this.stepThreeForm.patchValue({
        billingState: '',
        billingCity: ''
      });
    }
  }

  chekcProperZipCode(ev: any) {
    if (ev.target.value.length > 4) {
      this.validZip = false;
      console.log(ev.target.value);
      this.validZipMessage = '';
      this.apiService.post(AppConfig.apiUrl.common.locationByZip, { zip: ev.target.value.toString() }).subscribe({
        next: (response: any) => {
          if (response.status == 1) {
            if (response.data.is_serviceable == 1 && response.data.active_status == 1) {
              this.validZip = true;
              this.stepThreeForm.patchValue({
                propertyState: response.data.state,
                propertyCity: response.data.city
              });
              setTimeout(() => {
                this.formValidationService.forms();
              }, 400);
            } else {
              this.validZip = false;
              this.validZipMessage = 'Unavailable services in this zip code';
            }
          } else {
            this.stepThreeForm.patchValue({
              propertyState: '',
              propertyCity: ''
            });
            this.validZipMessage = response.message;
          }
        },
        error: (er) => {

        },
        complete: () => {
          if (!this.validZip) {
            this.stepThreeForm.patchValue({
              propertyState: '',
              propertyCity: ''
            });
          }
          setTimeout(() => {
            this.formValidationService.forms();
          }, 400);
        }
      });
    } else {
      this.stepThreeForm.patchValue({
        propertyState: '',
        propertyCity: ''
      });
    }
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

  setSamePropertyAddress(ev: any) {
    if (this.s3['propertyAddressOne'].value == '') {
      ev.preventDefault();
      let checkBox: any = document.getElementById('isSamePropertyAddress');
      checkBox.checked = false;
      this.alertService.warning('Please enter your property address');
      return;
    }
    if (this.isSamePropertyAddress) {
      this.stepThreeForm.patchValue({
        billingAddress: this.s3['propertyAddressOne'].value,
        billingZipCode: this.s3['propertyZipCode'].value,
        billingState: this.s3['propertyState'].value,
        billingCity: this.s3['propertyCity'].value
      })

      if (this.s3['propertyZipCode'].value) {
        let data: any = {
          target: {
            value: this.s3['propertyZipCode'].value
          }

        }
        this.chekcBillingZipCode(data)
      }
      this.validBillingZip = this.validZip;
    } else {
      this.stepThreeForm.patchValue({
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

  changePolicyTerm() {
    if (this.planTermSelection == 1) {
      this.planTerm = false;
    } else {
      this.planTerm = true;
    }

    if (this.propertySizeId != null || this.propertySizeId != undefined) {
      this.planList.some((plan: any) => {
        if (plan.is_active) {
          return plan.plan_term.some((term: any) => {
            if (term.plan_term_month == this.planTermSelection && this.activePlan.plan_id == term.plan_id && this.s3['propertyTypeId'].value == term.property_type_id && this.s3['propertySizeId'].value == 1) {
              this.selectedPlanPrice = term.price_above_5000_sqft;
              this.planTermsId = term.plan_terms_id;
              this.totalPolicyTerm = term.plan_term.toLowerCase();
              return true; // terminate the loop
            }
            if (term.plan_term_month == this.planTermSelection && this.activePlan.plan_id == term.plan_id && this.s3['propertyTypeId'].value == term.property_type_id && this.s3['propertySizeId'].value == 0) {
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
              if (term.plan_term_month == this.planTermSelection && plan.plan_id == term.plan_id && this.s3['propertyTypeId'].value == term.property_type_id) {
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

  changeBillingAddress(ev: any) {
    // console.log(ev.target.value.length);
    if (ev.target.value.length < 5) {
      this.stepThreeForm.patchValue({
        billingState: '',
        billingCity: ''
      });
    }

    this.isSamePropertyAddress = false;
  }

  async stepThreeSubmit() {
    this.stepThreeSubmitted = true;

    console.log('this.stepThreeForm.valid',this.stepThreeForm.valid);
    console.log('this.stepThreeForm.validZip',this.validZip);
    console.log('this.validBillingZip',this.validBillingZip);
    
    if (!this.stepThreeForm.valid || !this.validZip || !this.validBillingZip) {
      this.formValidationService.validateAllFormFields(this.stepThreeForm);
      return
    }
    // if (!this.termsCondition) {
    //   this.alertService.error('Please agree with our terms & conditions.');
    //   return;
    // }

    let termObj: any = {}
    this.activePlan.plan_term.forEach((term: any) => {
      if (term.plan_term.toLowerCase() == this.totalPolicyTerm.toLowerCase()) {
        termObj = term;
      }
    });
    let postData: any = {};
    postData.firstName = this.leadDetails.first_name;
    postData.lastName = this.leadDetails.last_name;
    postData.emailId = this.leadDetails.email;
    postData.mobileNo = this.commonSvc.convertToNormalPhoneNumber(this.leadDetails.mobile);
    postData.billingAddress = this.s3['billingAddress'].value;
    postData.billingZipCode = this.s3['billingZipCode'].value;
    postData.billingState = this.s3['billingState'].value;
    postData.billingCity = this.s3['billingCity'].value;
    postData.zipCode = this.s3['propertyZipCode'].value;
    postData.state = this.s3['propertyState'].value;
    postData.city = this.s3['propertyCity'].value;
    postData.planName = this.activePlan.plan_name
    postData.address1 = this.s3['propertyAddressOne'].value;
    postData.planId = this.activePlan.plan_id
    postData.leadId = this.leadDetails.lead_id;
    postData.policyTerm = this.totalPolicyTerm;
    postData.policyTermMonth = this.planTermSelection;
    postData.planTermId = this.planTermsId;
    postData.propertyType = this.s3['propertyTypeId'].value;
    postData.propertySize = this.s3['propertySizeId'].value;
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
    postData.cardHolderName = this.s3['cardHolderName'].value ? this.s3['cardHolderName'].value : null;
    postData.cardNumber = this.s3['cardNumber'].value ? this.s3['cardNumber'].value.replace(/\s/g, "") : null;
    postData.expiryDate = this.s3['expiryDate'].value ? this.s3['expiryDate'].value.replace(/\//g, '') : null;
    postData.cardCode = this.s3['cvv'].value ? this.s3['cvv'].value : null;
    postData.bankAccountHolderName = this.s3['bankAccountHolderName'].value ? this.s3['bankAccountHolderName'].value : null;
    postData.bankAccountNumber = this.s3['bankAccountNumber'].value ? this.s3['bankAccountNumber'].value : null;
    postData.routingNumber = this.s3['routingNumber'].value ? this.s3['routingNumber'].value : null;
    this.loading = true;
    const token = await this.recaptchaV3Service.execute('submitStepFourFromFunnel').toPromise();
    let res: any = await this.commonSvc.verifyreCaptcha(token);
    if (res.status == 1) {
      //  this.createAndUpdateLead(postData);
      this.updateCustomerPolicyAndpayment(postData);
    } else {
      this.loading = false;
    }
  }

  updateCustomerPolicyAndpayment(obj: any) {
    this.apiService.post(`${AppConfig.apiUrl.policy.createPolicy}`, obj).subscribe({
      next: (response: any) => {
        console.log('response', response);
        this.loading = false;
        if (response.status == 1) {
          localStorage.removeItem('zip');
          localStorage.removeItem('mobile');
          localStorage.removeItem('email');
          localStorage.removeItem('lead_id');
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

  async createAndUpdateLead(obj: any) {
    let leadData = await this.updateLeadInVanillaSoft(obj);
    obj.lead_data = leadData
    this.apiService.post(`${AppConfig.apiUrl.lead.createUpdateLead}`, obj).subscribe({
      next: (response: any) => {
        console.log('response', response);
        if (response.status == 1) {
          localStorage.setItem('lead_obj', JSON.stringify(response.data.lead_data));
          this.loading = false;
        } else {
          this.loading = false;
          this.alertService.error(response.message);
        }
      }
    });
  }


  async updateLeadFields(field: any) {
    if (field == 'propertyAddressOne') {
      field = 'property_address1'
    }
    if (field == 'policyTerm') {
      field = 'policy_term'
    }
    return field
  }

  async updateLeadInVanillaSoft(postData: any) {
    let leadData: any = {};
    let leadObj: any = localStorage.getItem('lead_obj');
    leadData = JSON.parse(leadObj)
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

    if (postData['city']) {
      leadData['city'] = postData['city']
    }
    if (postData['state']) {
      leadData['state'] = postData['state']
    }
    if (postData['zipCode']) {
      leadData['zipcode'] = postData['zipCode']
    }
    if (postData['emailAddress']) {
      leadData['email'] = postData['emailAddress']
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

    // console.log('leadData', leadData);
    return leadData
  }

  mszKeyDown(e: any): any {
    if (e.which === 32 && !e.target.value.length) {
      e.preventDefault();
    }
  }

  preventNumberInput(e: any) {
    var keyCode = (e.keyCode ? e.keyCode : e.which);
    if (keyCode > 47 && keyCode < 58 || keyCode > 95 && keyCode < 107) {
      e.preventDefault();
    }
  }

  ngOnDestroy() {
    localStorage.removeItem('zip');
    localStorage.removeItem('mobile');
    localStorage.removeItem('email');
    localStorage.removeItem('lead_id');
  }

  stepBack() {
    this.stepper.previous();
  }
  stepBackToLanding() {
    this.router.navigate(['/home-warranty-quotes']);
  }
}

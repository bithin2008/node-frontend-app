import { Component, ViewChild } from '@angular/core';
import { CdkStepper } from '@angular/cdk/stepper';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/@core/services/alert.service';
import { FormValidationService } from 'src/app/@core/services/form-validation.service';
import { ApiService } from 'src/app/@core/services/api.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/@core/services/common.service';
import { AppConfig } from 'src/app/@utils/const/app.config';
import * as _ from "lodash";
import { SharedService } from 'src/app/@core/services/shared.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
declare var google: any;
@Component({
  selector: 'app-create-policy',
  templateUrl: './create-policy.component.html',
  styleUrls: ['./create-policy.component.scss']
})
export class CreatePolicyComponent {
  @ViewChild(CdkStepper) stepper!: CdkStepper;
  public stepOneForm!: FormGroup;
  public stepTwoForm!: FormGroup;
  public stepThreeForm!: FormGroup;
  public stepFourForm!: FormGroup;
  public stepOneSubmitted: boolean = false;
  public stepTwoSubmitted: boolean = false;
  public stepThreeSubmitted: boolean = false;
  public stepFourSubmitted: boolean = false;

  public realtorDetails: any = {};

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
  public showAddonItem: boolean = false;

  public stepperBackBtn: boolean = false;
  public currentStep: number = 0;
  public termsCondition: boolean = false;

  public loading: boolean = false;
  public validZip: boolean = false;
  public validZipMessage: any = '';

  public hasCompanyInfo: boolean = false;
  public validSellerEmail: boolean = false;
  public options = {
    types: ["address"],
    componentRestrictions: {
      country: 'us'
    }
  };
  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private alertService: AlertService,
    private formValidationService: FormValidationService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private apiService: ApiService,
    private router: Router,
    private commonSvc: CommonService,
  ) {
    this.commonSvc.setTitle('First Premier Home Warranty: Checkout');

    this.sharedService.sharedRealtorData$.subscribe((response: any) => {
      if (response) {
        this.realtorDetails = response.data;
      }
    })
    this.stepOneForm = this.fb.group({
      propertyAddress: ['', [Validators.required, this.formValidationService.notEmpty]],
      propertyZipCode: ['', [Validators.required]],
      propertyState: ['', [Validators.required]],
      propertyCity: ['', [Validators.required]],
      propertyTypeId: ['1', [Validators.required, this.formValidationService.notEmpty]],
      propertySizeId: ['0', [Validators.required]],
    });
    this.stepTwoForm = this.fb.group({
      buyerFirstName: ['', [Validators.required]],
      buyerLastName: ['', [Validators.required]],
      buyerEmail: ['', [Validators.required, this.formValidationService.notEmpty, this.formValidationService.validEmail]],
      buyerMobile: ['', [Validators.required, this.formValidationService.phoneNumberUS]],
      sellerFirstName: [''],
      sellerLastName: [''],
      sellerEmail: ['', [this.formValidationService.validEmail]],
      sellerMobile: ['', [this.formValidationService.phoneNumberUS]],
      //  policyBelongs: [''],
      companyName: ['', [Validators.required]],
      companyContactPerson: ['', [Validators.required]],
      companyEmail: ['', [Validators.required, this.formValidationService.notEmpty, this.formValidationService.validEmail]],
      companyMobile: ['', [Validators.required, this.formValidationService.phoneNumberUS]],
    });

    this.stepThreeForm = this.fb.group({
    });

    this.stepFourForm = this.fb.group({
      cardHolderName: ['', [Validators.required]],
      cardNumber: ['', [Validators.required]],
      expiryDate: ['', [Validators.required, this.formValidationService.validateExpirationDateFormat, this.formValidationService.expiryDateValidator]],
      cvv: ['', [Validators.required, this.formValidationService.validateCVV]]
    });

    // this.stepFourForm = this.fb.group({
    //   billingCity: [''],
    //   billingState: [''],
    //   billingZipCode: ['', [Validators.required, this.formValidationService.numericOnly]],
    //   billingAddress: ['', [Validators.required, this.formValidationService.notEmpty]],

    //   bankAccountHolderName: ['', [Validators.required, this.formValidationService.notEmpty]],
    //   bankAccountNumber: ['', [Validators.required]],
    //   routingNumber: ['', [Validators.required, this.formValidationService.usBankRouting]],

    //   cardHolderName: ['', [Validators.required]],
    //   cardNumber: ['', [Validators.required]],
    //   expiryDate: ['', [Validators.required, this.formValidationService.validateExpirationDateFormat, this.formValidationService.expiryDateValidator]],
    //   cvv: ['', [Validators.required, this.formValidationService.validateCVV]]
    // });


  }

  ngOnInit(): void {
    this.getAllPropertyTypes();
    this.getAllPlans();
    this.getAllAddonProducts();
    this.getAllPolicyTerms();
  }




  ngAfterViewInit() {
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


    let input:any = document.getElementById("addressBar");
    const autocomplete = new google.maps.places.Autocomplete(input, this.options);
    autocomplete.addListener("place_changed", () => {
      this.stepOneForm.patchValue({
        propertyAddress: input.value,
      })
      const place = autocomplete.getPlace();
      var zipCode = this.getZipCodeFromPlace(place);
      console.log('zipCode',zipCode);

      if(zipCode){
        this.stepOneForm.patchValue({
          propertyZipCode: zipCode,
        })
        let zipData:any={
          target:{
            value:zipCode
          }
        }
      this.chekcZipCode(zipData);
      }
    });
    setTimeout(() => {
      this.formValidationService.forms();
    }, 750);
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

  get s1() { return this.stepOneForm.controls; }
  get s2() { return this.stepTwoForm.controls; }
  get s4() { return this.stepFourForm.controls; }


  onStepChanged(event: any) {
    if (event.selectedIndex == 2 && event.previouslySelectedIndex == 1) {
      this.changePlanTerm();
    }
  }

  previousStep() {
    this.stepper.previous();
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
              this.stepOneForm.patchValue({
                propertyState: response.data.state,
                propertyCity: response.data.city
              });
              this.formValidationService.forms();
            } else {
              this.validZipMessage = 'Unavailable services in this zip code';
            }
          } else {
            this.validZipMessage = response.message;
            this.stepOneForm.patchValue({
              propertyState: '',
              propertyCity: ''
            });
          }
        },
        error: (er) => {
          this.loading = false;
        },
        complete: () => {
          if (!this.validZip) {
            this.stepOneForm.patchValue({
              propertyState: '',
              propertyCity: ''
            });
          }
          this.loading = false;
        }
      });
    } else {
      this.validZipMessage = '';
      this.stepOneForm.patchValue({
        propertyState: '',
        propertyCity: ''
      });
    }
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

  getAllPlans() {
    this.apiService.get(`${AppConfig.apiUrl.common.getAllPlans}?active_status=1`).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          response.data.forEach((element: any) => {
            // if (element.plan_name.toLowerCase() == 'platinum' || element.plan_name.toLowerCase() == 'premier') {

            // }
            if (element.plan_id == 2) {
              element.is_active=true;
              this.activePlan = element
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
    this.stepOneForm.patchValue({
      propertyZipCode: inputValue
    });
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

  getSelectedPropertyText() {
    let selectElement: any = document.getElementById('propertyType');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    this.propertyTypeText = selectedOption.text;
  }

  toggleCompanyInfo() {
    this.stepTwoForm.controls['companyName'].enable();
    this.stepTwoForm.controls['companyContactPerson'].enable();
    this.stepTwoForm.controls['companyEmail'].enable();
    this.stepTwoForm.controls['companyMobile'].enable();
    if (this.hasCompanyInfo) {
      this.stepTwoForm.controls['companyName'].setValue(null);
      this.stepTwoForm.controls['companyName'].clearValidators();
      this.stepTwoForm.controls['companyName'].updateValueAndValidity();
      this.stepTwoForm.controls['companyContactPerson'].setValue(null);
      this.stepTwoForm.controls['companyContactPerson'].clearValidators();
      this.stepTwoForm.controls['companyContactPerson'].updateValueAndValidity();
      this.stepTwoForm.controls['companyEmail'].setValue(null);
      this.stepTwoForm.controls['companyEmail'].clearValidators();
      this.stepTwoForm.controls['companyEmail'].updateValueAndValidity();
      this.stepTwoForm.controls['companyMobile'].setValue(null);
      this.stepTwoForm.controls['companyMobile'].clearValidators();
      this.stepTwoForm.controls['companyMobile'].updateValueAndValidity();

      this.stepTwoForm.controls['companyName'].disable();
      this.stepTwoForm.controls['companyContactPerson'].disable();
      this.stepTwoForm.controls['companyEmail'].disable();
      this.stepTwoForm.controls['companyMobile'].disable();
    } else {


      this.stepTwoForm.controls["companyName"].setValidators(Validators.required);
      this.stepTwoForm.controls["companyName"].updateValueAndValidity();
      this.stepTwoForm.controls["companyContactPerson"].setValidators(Validators.required);
      this.stepTwoForm.controls["companyContactPerson"].updateValueAndValidity();
      this.stepTwoForm.controls["companyEmail"].setValidators([Validators.required, this.formValidationService.notEmpty, this.formValidationService.validEmail]);
      this.stepTwoForm.controls["companyEmail"].updateValueAndValidity();
      this.stepTwoForm.controls["companyMobile"].setValidators([Validators.required, this.formValidationService.phoneNumberUS]);
      this.stepTwoForm.controls["companyMobile"].updateValueAndValidity();



    }
  }

  emailInputValidate() {
    this.validSellerEmail = this.s2['sellerEmail'].status == 'VALID' ? true : false;
    if (this.validSellerEmail) {
      this.stepTwoForm.controls["policyBelongs"].setValidators(Validators.required);
      this.stepTwoForm.controls["policyBelongs"].updateValueAndValidity();
    } else {
      this.stepTwoForm.controls["policyBelongs"].clearValidators();
      this.stepTwoForm.controls["policyBelongs"].updateValueAndValidity();
    }

    if (this.s2['sellerEmail'].value.length == 0) {
      this.stepTwoForm.controls["policyBelongs"].clearValidators();
      this.stepTwoForm.controls["policyBelongs"].updateValueAndValidity();
      this.validSellerEmail = false;
    }

  }

  stepOneSubmit() {
    this.stepOneSubmitted = true
    if (!this.stepOneForm.valid) {
      this.formValidationService.validateAllFormFields(this.stepOneForm);
      return
    }
    this.stepper.next();
    window.scrollTo(0, 0);
  }

  stepTwoSubmit() {
    this.stepOneSubmitted = true
    if (!this.stepTwoForm.valid) {
      this.formValidationService.validateAllFormFields(this.stepTwoForm);
      return
    }
    this.stepper.next();
    window.scrollTo(0, 0);
  }


  stepThreeSubmit() {
    if (Object.keys(this.activePlan).length != 0) {
      this.stepper.next();
      window.scrollTo(0, 0);
      for (let objData in this.groupedData) {
        let filteredData = _.filter(this.groupedData[objData], { 'plan_id': this.activePlan.plan_id, 'property_type_id': this.s1['propertyTypeId'].value })
        if (filteredData.length > 0) {
          this.groupedData[objData] = filteredData;
        }
      }

      // Convert the groupedData object back to an array
      let groupedArray = Object.keys(this.groupedData).map((month) => ({
        plan_term_month: parseInt(month, 10), // Convert back to a number
        plan_term: this.groupedData[month][0].plan_term
        // data: groupedData[month], // The array of items for this month
      }));

      groupedArray = _.reject(groupedArray,
        { 'plan_term_month': 1 });
      this.policyTerm = groupedArray;
      setTimeout(() => {
        let termValueRadio: any = document.getElementById('policyTerm-' + this.planTermSelection)
        termValueRadio.checked = true;
      }, 800);
    } else {
      this.alertService.error('Please select plan');
      return;
    }
  }

  disableClick() {
    if (!this.activePlan) {
      this.alertService.error('Please select plan');
      return;
    } else {
      if (Object.keys(this.activePlan).length == 0) {
        this.alertService.error('Please select plan');
      }
    }
  }

  changePlanTerm() {
    if (this.planTerm) {
      this.planTermSelection = 12
    } else {
      this.planTermSelection = 1;
    }

    if (this.s1['propertySizeId'].value) {
      this.planList.forEach((plan: any) => {
        if (plan.is_active) {
          plan.plan_term.some((term: any) => {
            if (this.planTerm) {
              if (term.plan_term_month == 12 && this.activePlan.plan_id == term.plan_id && this.s1['propertyTypeId'].value == term.property_type_id && this.s1['propertySizeId'].value == 1) {
                this.selectedPlanPrice = term.price_above_5000_sqft;
                plan.price_above_5000_sqft = term.price_above_5000_sqft;
                this.planTermsId = term.plan_terms_id;
                return true; // this will break out of the loop
              }
              if (term.plan_term_month == 12 && this.activePlan.plan_id == term.plan_id && this.s1['propertyTypeId'].value == term.property_type_id && this.s1['propertySizeId'].value == 0) {
                this.selectedPlanPrice = term.price_below_5000_sqft;
                plan.price_below_5000_sqft = term.price_below_5000_sqft;
                this.planTermsId = term.plan_terms_id;
                return true; // this will break out of the loop
              }
            } else {
              if (term.plan_term_month == 1 && this.activePlan.plan_id == term.plan_id && this.s1['propertyTypeId'].value == term.property_type_id && this.s1['propertySizeId'].value == 1) {
                this.selectedPlanPrice = term.price_above_5000_sqft;
                plan.price_above_5000_sqft = term.price_above_5000_sqft;
                this.planTermsId = term.plan_terms_id;
                return true; // this will break out of the loop
              }
              if (term.plan_term_month == 1 && this.activePlan.plan_id == term.plan_id && this.s1['propertyTypeId'].value == term.property_type_id && this.s1['propertySizeId'].value == 0) {
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
              if (term.plan_term_month == 12 && plan.plan_id == term.plan_id && this.s1['propertyTypeId'].value == term.property_type_id) {
                plan.price_above_5000_sqft = term.price_above_5000_sqft;
                plan.price_below_5000_sqft = term.price_below_5000_sqft;
                this.planTermsId = term.plan_terms_id;
              }
            } else {
              if (term.plan_term_month == 1 && plan.plan_id == term.plan_id && this.s1['propertyTypeId'].value == term.property_type_id) {
                plan.price_above_5000_sqft = term.price_above_5000_sqft;
                plan.price_below_5000_sqft = term.price_below_5000_sqft;
                this.planTermsId = term.plan_terms_id;
              }
            }
          });
        }
      });

    }
    console.log('this.planList', this.planList);

    this.calculateAllAddonProductPrice();
  }

  changePolicyTerm(obj: any) {
    this.planTermSelection = obj.plan_term_month;
    if (this.planTermSelection == 1) {
      this.planTerm = false;
      // let ccTab: any = document.getElementsByClassName('credit-card');
      // ccTab[0].click();
    } else {
      this.planTerm = true;
    }

    setTimeout(() => {
      let termValueRadio: any = document.getElementById('policyTerm-' + this.planTermSelection)
      termValueRadio.checked = true;
    }, 250);

    if (this.s1['propertySizeId'].value) {
      this.planList.some((plan: any) => {
        if (plan.is_active) {
          return plan.plan_term.some((term: any) => {
            if (term.plan_term_month == this.planTermSelection && this.activePlan.plan_id == term.plan_id && this.s1['propertyTypeId'].value == term.property_type_id && this.s1['propertySizeId'].value == 1) {
              this.selectedPlanPrice = term.price_above_5000_sqft;
              this.planTermsId = term.plan_terms_id;
              this.totalPolicyTerm = term.plan_term.toLowerCase();
              return true; // terminate the loop
            }
            if (term.plan_term_month == this.planTermSelection && this.activePlan.plan_id == term.plan_id && this.s1['propertyTypeId'].value == term.property_type_id && this.s1['propertySizeId'].value == 0) {
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
              if (term.plan_term_month == this.planTermSelection && plan.plan_id == term.plan_id && this.s1['propertyTypeId'].value == term.property_type_id) {
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
            if (term.plan_term_month == 12 && plan.plan_id == term.plan_id && this.s1['propertyTypeId'].value == term.property_type_id && this.s1['propertySizeId'].value == 1) {
              this.selectedPlanPrice = term.price_above_5000_sqft;
              this.planTermsId = term.plan_terms_id;
            }
            if (term.plan_term_month == 12 && plan.plan_id == term.plan_id && this.s1['propertyTypeId'].value == term.property_type_id && this.s1['propertySizeId'].value == 0) {
              this.selectedPlanPrice = term.price_below_5000_sqft;
              this.planTermsId = term.plan_terms_id;
            }
          } else {
            if (term.plan_term_month == 1 && plan.plan_id == term.plan_id && this.s1['propertyTypeId'].value == term.property_type_id && this.s1['propertySizeId'].value == 1) {
              this.selectedPlanPrice = term.price_above_5000_sqft;
              this.planTermsId = term.plan_terms_id;
            }
            if (term.plan_term_month == 1 && plan.plan_id == term.plan_id && this.s1['propertyTypeId'].value == term.property_type_id && this.s1['propertySizeId'].value == 0) {
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

  buyerChangePhoneFormat(e: any) {
    this.stepTwoForm.controls['buyerMobile'].setValue(this.commonSvc.setUSFormatPhoneNumber(e.target.value.toString()));
  }

  sellerChangePhoneFormat(e: any) {
    this.stepTwoForm.controls['sellerMobile'].setValue(this.commonSvc.setUSFormatPhoneNumber(e.target.value.toString()));
  }

  companyChangePhoneFormat(e: any) {
    this.stepTwoForm.controls['companyMobile'].setValue(this.commonSvc.setUSFormatPhoneNumber(e.target.value.toString()));
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
    } else {
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


  async stepFourSubmit() {
    this.stepFourSubmitted = true;

    if (!this.stepFourForm.valid) {
      this.formValidationService.validateAllFormFields(this.stepFourForm);
      return
    }
    if (!this.termsCondition) {
      this.alertService.error('Please agree with our terms & conditions.');
      return;
    }

    let termObj: any = {}
    this.activePlan.plan_term.forEach((term: any) => {
      if (term.plan_term.toLowerCase() == this.totalPolicyTerm.toLowerCase()) {
        termObj = term;
      }
    });
    let postData: any = {};
    postData.firstName = this.s2['buyerFirstName'].value ? this.s2['buyerFirstName'].value : null;
    postData.lastName = this.s2['buyerLastName'].value ? this.s2['buyerLastName'].value : null;
    postData.emailId = this.s2['buyerEmail'].value ? this.s2['buyerEmail'].value : null;
    postData.mobileNo = this.commonSvc.convertToNormalPhoneNumber(this.s2['buyerMobile'].value) ? this.commonSvc.convertToNormalPhoneNumber(this.s2['buyerMobile'].value) : null;

    postData.billingAddress = this.s1['propertyAddress'].value; //this.realtorDetails.office_address;
    postData.billingZipCode = this.s1['propertyZipCode'].value; //this.realtorDetails.office_zip;
    postData.billingState =  this.s1['propertyState'].value; //this.realtorDetails.office_state;
    postData.billingCity = this.s1['propertyCity'].value; //this.realtorDetails.office_city;

    postData.zipCode = this.s1['propertyZipCode'].value;
    postData.state = this.s1['propertyState'].value;
    postData.city = this.s1['propertyCity'].value;
    postData.planName = this.activePlan.plan_name
    postData.address1 = this.s1['propertyAddress'].value;
    postData.planId = this.activePlan.plan_id
    postData.policyTerm = this.totalPolicyTerm;
    postData.policyTermMonth = this.planTermSelection;
    postData.planTermId = this.planTermsId;
    postData.propertyType = this.s1['propertyTypeId'].value;
    postData.propertySize = this.s1['propertySizeId'].value;
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
    postData.createUserType = 3;
    postData.paymentType = this.currenctPaymentType;
    postData.cardHolderName = this.s4['cardHolderName'].value ? this.s4['cardHolderName'].value : null;
    postData.cardNumber = this.s4['cardNumber'].value ? this.s4['cardNumber'].value.replace(/\s/g, "") : null;
    postData.expiryDate = this.s4['expiryDate'].value ? this.s4['expiryDate'].value.replace(/\//g, '') : null;
    postData.cardCode = this.s4['cvv'].value ? this.s4['cvv'].value : null;


    postData.buyerFirstName = this.s2['buyerFirstName'].value ? this.s2['buyerFirstName'].value : null;
    postData.buyerLastName = this.s2['buyerLastName'].value ? this.s2['buyerLastName'].value : null;
    postData.buyerEmail = this.s2['buyerEmail'].value ? this.s2['buyerEmail'].value : null;
    postData.buyerMobile = this.s2['buyerMobile'].value ? this.commonSvc.convertToNormalPhoneNumber(this.s2['buyerMobile'].value) : null;


    postData.sellerFirstName = this.s2['sellerFirstName'].value ? this.s2['sellerFirstName'].value : null;
    postData.sellerLastName = this.s2['sellerLastName'].value ? this.s2['sellerLastName'].value : null;
    postData.sellerEmail = this.s2['sellerEmail'].value ? this.s2['sellerEmail'].value : null;
    postData.sellerMobile = this.s2['sellerMobile'].value ? this.commonSvc.convertToNormalPhoneNumber(this.s2['sellerMobile'].value) : null;
    postData.realtorId = this.realtorDetails.realestate_professional_id;
    postData.realtorEmail = this.realtorDetails.email;
    postData.hasCompanyInfo = this.hasCompanyInfo ? 0 : 1;
    postData.companyName = this.s2['companyName'].value ? this.s2['companyName'].value : null;
    postData.companyContactPerson = this.s2['companyContactPerson'].value ? this.s2['companyContactPerson'].value : null;
    postData.companyEmail = this.s2['companyEmail'].value ? this.s2['companyEmail'].value : null;
    postData.companyMobile = this.s2['companyMobile'].value ? this.commonSvc.convertToNormalPhoneNumber(this.s2['companyMobile'].value) : null;
    const token = await this.recaptchaV3Service.execute('creetePolicyFromRealestatePro').toPromise();
    let res: any = await this.commonSvc.verifyreCaptcha(token);
    if (res.status == 1) {

      this.updateRealtorPolicyAndPayment(postData);
    }
  }


  updateRealtorPolicyAndPayment(obj: any) {
    this.loading = true;
    this.apiService.post(`${AppConfig.apiUrl.realtorPortal.createPolicy}`, obj).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.status == 1) {
          window.scrollTo(0, 0);
          this.router.navigate(['realestate-professional-portal/thank-you'],{queryParams:{policyid:`${btoa(encodeURIComponent(response.data.policy_id))}`}});
        } else {
          this.alertService.error(response.message);
        }
      },
      error: () => { this.loading = false; },
      complete: () => { this.loading = false; }
    });
  }

}

import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CdkStepper } from '@angular/cdk/stepper';
import { AlertService } from 'src/app/@core/services/alert.service';
import { ApiService } from 'src/app/@core/services/api.service';
import { CommonService } from 'src/app/@core/services/common.service';
import { FormValidationService } from 'src/app/@core/services/form-validation.service';
import { SharedService } from 'src/app/@core/services/shared.service';
import { AppConfig } from 'src/app/@utils/const/app.config';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import * as moment from 'moment';
import * as _ from "lodash";
declare var google: any;
@Component({
  selector: 'app-create-policy',
  templateUrl: './create-policy.component.html',
  styleUrls: ['./create-policy.component.scss']
})
export class CreatePolicyComponent {
  @ViewChild(CdkStepper) stepper!: CdkStepper;
  @ViewChild('policyTermSelectBox') policyTermSelectBox!: ElementRef;
  public stepOneForm!: FormGroup;
  public stepTwoForm!: FormGroup;
  public stepThreeForm!: FormGroup;
  public stepFourForm!: FormGroup;
  public stepOneSubmitted: boolean = false;
  public stepTwoSubmitted: boolean = false;
  public stepThreeSubmitted: boolean = false;
  public stepFourSubmitted: boolean = false;
  public validZip: boolean = false;
  public validZipMessage: any = '';
  public loading: boolean = false;
  public customerObj: any = {};
  public planList: any = [];
  public policyTerm: any = [];
  public addOnProductList: any = [];
  public customerCardList: any = [];
  public groupedData: any = [];
  public propertyTypes: any = [];
  public selectedPlanDetails: any = {};
  public selectdAddOnProducts: any = [];
  public selectedPlanPrice: number = 0;
  public selectedPlanBonusMonth: number = 0;
  public selectedPlanTermId: number = 0;
  public totalAddonProductPrice: number = 0;
  public minDate: any;
  public currenctPaymentType: number = 1;
  public selectedPolicyTermText: any = 'Monthly';
  public selectedCardDetails: any = {};
  public cloneSelectedCardDetails: any = {};
  public options = {
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
    private sharedService: SharedService,
    private router: Router,
    private commonSvc: CommonService,
    private recaptchaV3Service: ReCaptchaV3Service,
  ) {
    this.commonSvc.setTitle('First Premier Home Warranty: Customer Portal');

    this.stepOneForm = this.fb.group({
      firstName: ['', [Validators.required, this.formValidationService.notEmpty]],
      lastName: ['', [Validators.required, this.formValidationService.notEmpty]],
      emailId: ['', [Validators.required, this.formValidationService.notEmpty, this.formValidationService.validEmail,]],
      mobileNo: ['', [Validators.required, this.formValidationService.phoneNumberUS,]],
      propertyZipCode: ['', [Validators.required]],
      propertyAddressOne: ['', [Validators.required, this.formValidationService.notEmpty]],
      propertyState: ['', [Validators.required]],
      propertyCity: ['', [Validators.required]],
    });

    this.stepTwoForm = this.fb.group({
      propertyTypeId: ['1', [Validators.required]],
      propertySizeId: ['0', [Validators.required]],
      policyStartDate: ['', [Validators.required]],
      selectedPlan: ['', [Validators.required]],
      selectedPolicyTerm: ['', [Validators.required]],
      policyEndDate: ['', [Validators.required]],
    });

    this.stepThreeForm = this.fb.group({
      cardHolderName: ['',[Validators.required]],
      cardNumber: ['',[Validators.required]],
      expiryDate: ['',[Validators.required, this.formValidationService.validateExpirationDateFormat, this.formValidationService.expiryDateValidator]],
      cvv: ['', [Validators.required, this.formValidationService.validateCVV]]
    });

    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
  }

  async ngAfterViewInit() {
    this.propertyTypes = await this.getAllPropertyTypes();
    this.planList = await this.getAllPlans();

    this.getAllAddonProducts();
    this.getAllPolicyTerms();


    this.sharedService.sharedCustomerData$.subscribe(async (response: any) => {
      if (response) {
        this.customerObj = response.data;
        console.log('this.customerObj', this.customerObj);
        this.stepOneForm.patchValue({
          firstName: response.data.first_name,
          lastName: response.data.last_name,
          emailId: response.data.email,
          mobileNo: this.commonSvc.setUSFormatPhoneNumber(response.data.mobile)
        })
        let savedCards: any = await this.apiService.post(`${AppConfig.apiUrl.customerPortal.getAllCustomerCards}/${this.customerObj.customer_id}`, '').toPromise();
        this.customerCardList = savedCards.data;
      }
    })
    this.formValidationService.forms();
    if (this.propertyTypes) {
      this.stepTwoForm.patchValue({
        propertyTypeId: 1,
        propertySizeId: 0,
      })
    }
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
        propertyAddressOne: input.value,
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

  validateInput(e: any): true | boolean {
    // Define a regular expression to match exactly four digits
    var regex = /^\d{4}$/;

    // Test the input against the regular expression
    if (this.s3['cvv'].value.toString().length == 3 || this.s3['cvv'].value.toString().length == 4) {
      console.log("Valid input: " + this.s3['cvv'].value);
      return true;
    } else {

      e.preventDefault();
      return false;
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

  allowOnlyNumber(event: any) {
    let inputValue: any = event.target.value;
    inputValue = inputValue.replace(/[^0-9]/g, '');
    inputValue = inputValue.slice(0, 5);
    this.stepOneForm.patchValue({
      propertyZipCode: inputValue
    });
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

  changePhoneFormat(e: any) {
    this.stepOneForm.controls['mobileNo'].setValue(this.commonSvc.setUSFormatPhoneNumber(e.target.value.toString()));
  }

  get s1() { return this.stepOneForm.controls; }
  get s2() { return this.stepTwoForm.controls; }
  get s3() { return this.stepThreeForm.controls; }
  get s4() { return this.stepFourForm.controls; }

  async getAllPropertyTypes() {
    let response: any = await this.apiService.get(`${AppConfig.apiUrl.common.getAllpropertyTypes}`).toPromise();
    if (response.status == 1) {
      return response.data;
    } else {
      return null;
    }
  }

  async getAllPlans() {
    let response: any = await this.apiService.get(`${AppConfig.apiUrl.common.getAllPlans}?active_status=1`).toPromise();
    if (response.status == 1) {
      return response.data;
    } else {
      return null;
    }
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

          const groupedArray = Object.keys(this.groupedData).map((month) => ({
            plan_term_month: parseInt(month, 10), // Convert back to a number
            plan_term: this.groupedData[month][0].plan_term
            // data: groupedData[month], // The array of items for this month
          }));
          this.policyTerm = groupedArray;
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

  onStepChanged(ev: any) {
    console.log('ev', ev);
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
    if (this.s2['selectedPolicyTerm'].value > 1) {
      this.totalAddonProductPrice = this.selectdAddOnProducts.reduce((accumulator: number, currentValue: any) => {
        return accumulator + currentValue.yearly_price * (this.s2['selectedPolicyTerm'].value / 12);
      }, 0);
      this.totalAddonProductPrice = this.totalAddonProductPrice;
    } else {
      this.totalAddonProductPrice = this.selectdAddOnProducts.reduce((accumulator: number, currentValue: any) => {
        return accumulator + currentValue.monthly_price;
      }, 0);
    }
  }

  changePlan() {
    let selectedPlan = _.filter(this.planList, { 'plan_id': parseInt(this.s2['selectedPlan'].value) })
    if (selectedPlan.length > 0) {
      this.selectedPlanDetails = selectedPlan[0];
      let currentPlanTerm = _.filter(this.selectedPlanDetails.plan_term, { 'plan_term_month': parseInt(this.s2['selectedPolicyTerm'].value), 'plan_id': parseInt(this.s2['selectedPlan'].value), 'property_type_id': parseInt(this.s2['propertyTypeId'].value) });
      if (currentPlanTerm.length > 0) {
        this.selectedPlanTermId = currentPlanTerm[0].plan_terms_id;
        if (this.s2['propertySizeId'].value == 0) {
          this.selectedPlanPrice = currentPlanTerm[0].price_below_5000_sqft;
        } else {
          this.selectedPlanPrice = currentPlanTerm[0].price_above_5000_sqft;
        }
        this.selectedPlanBonusMonth = currentPlanTerm[0].bonus_month
      }
    }
    this.calculateAllAddonProductPrice();
  }

  handleDateChange(ev: any) {
    let lastDate;
    if (this.s2['selectedPolicyTerm'].value == 1) {
      lastDate = moment(this.s2['policyStartDate'].value).add(30, 'days')
    } else {
      lastDate = moment(this.s2['policyStartDate'].value).add((this.s2['selectedPolicyTerm'].value / 12), 'years')
    }

    if (lastDate.isValid()) {
      this.stepTwoForm.patchValue({
        policyEndDate: lastDate.format('YYYY-MM-DD')
      })
    } else {
      this.stepTwoForm.patchValue({
        policyEndDate: lastDate.endOf('month').format('YYYY-MM-DD')
      })
    }
  }

  openTab(evt: any, tabName: any) {
    var i, tabContent: any, tabLinks;
    console.log('evt', evt);

    //evt.target.closest(".container");
    // Hide all tab content
    tabContent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabContent.length; i++) {
      tabContent[i].style.display = "none";
      tabContent[i].classList.remove("active");
    }

    // Deactivate all tab links
    tabLinks = document.getElementsByClassName("tab");
    for (i = 0; i < tabLinks.length; i++) {
      tabLinks[i].classList.remove("active");
    }
    let el: any = document.getElementById(tabName)
    el.style.display = "block";
    el.classList.add("active");
    evt.target.classList.add("active");
    if (tabName == 'tab1') {
      this.currenctPaymentType = 1;
    } else {
      this.currenctPaymentType = 2;
      this.selectedCardDetails = {};
    }
  }

  selectPrimaryCard() {
    this.customerCardList.forEach((card: any) => {
      if (card.primary_card) {
        this.selectedCardDetails = card;
        let primaryCardCheck: any = document.getElementById('card-' + card.customer_card_id);
        if (primaryCardCheck) {
          primaryCardCheck.checked = true;
        }
      }
    });
  }

  changePropertySize() {
    this.planList.forEach((plan: any) => {
      let currentPlanTerm = _.filter(plan.plan_term, { 'plan_term_month': parseInt(this.s2['selectedPolicyTerm'].value), 'plan_id': parseInt(this.s2['selectedPlan'].value), 'property_type_id': parseInt(this.s2['propertyTypeId'].value) });
      if (currentPlanTerm.length > 0) {
        this.selectedPlanTermId = currentPlanTerm[0].plan_terms_id;
        if (this.s2['propertySizeId'].value == 0) {
          this.selectedPlanPrice = currentPlanTerm[0].price_below_5000_sqft;
        } else {
          this.selectedPlanPrice = currentPlanTerm[0].price_above_5000_sqft;
        }
        this.selectedPlanBonusMonth = currentPlanTerm[0].bonus_month;
      }
    });
    this.calculateAllAddonProductPrice();
  }


  changePropertyType() {
    this.changePropertySize();
  }

  changePolicyTerm() {
    const selectedOptionElement: HTMLSelectElement = this.policyTermSelectBox.nativeElement;
    this.selectedPolicyTermText = selectedOptionElement.options[selectedOptionElement.selectedIndex].text;

    let lastDate;
    if (this.s2['selectedPolicyTerm'].value == 1) {
      lastDate = moment(this.s2['policyStartDate'].value).add(30, 'days')
    } else {
      lastDate = moment(this.s2['policyStartDate'].value).add((this.s2['selectedPolicyTerm'].value / 12), 'years')
    }

    if (lastDate.isValid()) {
      this.stepTwoForm.patchValue({
        policyEndDate: lastDate.format('YYYY-MM-DD')
      })
    } else {
      this.stepTwoForm.patchValue({
        policyEndDate: lastDate.endOf('month').format('YYYY-MM-DD')
      })
    }
    this.formValidationService.forms();

    this.planList.forEach((plan: any) => {
      let currentPlanTerm = _.filter(plan.plan_term, { 'plan_term_month': parseInt(this.s2['selectedPolicyTerm'].value), 'plan_id': parseInt(this.s2['selectedPlan'].value), 'property_type_id': this.s2['propertyTypeId'].value });
      if (currentPlanTerm.length > 0) {
        this.selectedPlanTermId = currentPlanTerm[0].plan_terms_id;
        if (this.s2['propertySizeId'].value == 0) {
          this.selectedPlanPrice = currentPlanTerm[0].price_below_5000_sqft;
        } else {
          this.selectedPlanPrice = currentPlanTerm[0].price_above_5000_sqft;
        }
        this.selectedPlanBonusMonth = currentPlanTerm[0].bonus_month
      }
    });
    this.calculateAllAddonProductPrice();
  }

  selectSavedCard(obj: any) {
    this.selectedCardDetails = obj;
  }

  changeCardOption(ev: any) {
    console.log(ev.target.value);
    let cardDetails: any = document.getElementsByClassName('cc_card_detls');
    [...cardDetails].forEach((el) => {
      if (el.classList.contains('active')) {
        el.classList.remove('active')
      }
      el.style.display = 'none';
    });
    let currentBlock: any = document.getElementsByClassName(ev.target.value);
    currentBlock[0].style.display = 'block';
    currentBlock[0].classList.add('active');
    this.cloneSelectedCardDetails = { ...this.selectedCardDetails }
    if (ev.target.value == 'new_card') {
      this.selectedCardDetails = {};
      this.stepThreeForm.controls['cardHolderName'].setValidators([Validators.required])
      this.stepThreeForm.controls['cardHolderName'].updateValueAndValidity();
      this.stepThreeForm.controls['cardNumber'].setValidators([Validators.required])
      this.stepThreeForm.controls['cardNumber'].updateValueAndValidity();
      this.stepThreeForm.controls['expiryDate'].setValidators([Validators.required, this.formValidationService.validateExpirationDateFormat, this.formValidationService.expiryDateValidator])
      this.stepThreeForm.controls['expiryDate'].updateValueAndValidity();
      this.stepThreeForm.controls['cvv'].setValidators([Validators.required, this.formValidationService.validateCVV])
      this.stepThreeForm.controls['cvv'].updateValueAndValidity();
    } else {
      this.selectedCardDetails = this.cloneSelectedCardDetails;
      this.stepThreeForm.controls['cardHolderName'].clearValidators();
      this.stepThreeForm.controls['cardHolderName'].updateValueAndValidity();
      this.stepThreeForm.controls['cardNumber'].clearValidators();
      this.stepThreeForm.controls['cardNumber'].updateValueAndValidity();
      this.stepThreeForm.controls['expiryDate'].clearValidators();
      this.stepThreeForm.controls['expiryDate'].updateValueAndValidity();
      this.stepThreeForm.controls['cvv'].clearValidators();
      this.stepThreeForm.controls['cvv'].updateValueAndValidity();
    }

  }

  stepOneSubmit() {
    console.log(this.stepOneForm);
    this.stepOneSubmitted = true
    if (!this.stepOneForm.valid) {
      this.formValidationService.validateAllFormFields(this.stepOneForm);
      return
    }
    this.stepper.next();
    setTimeout(() => {
      let policyStartDate = null;
      policyStartDate = moment().add(30, 'days');

      if (!policyStartDate.isValid()) {
        const lastValidDate = moment(policyStartDate).add(30, 'days').endOf('month');
        policyStartDate = lastValidDate;
      }
      let defaultPlan = _.filter(this.planList, { 'plan_id': 2 })
      this.selectedPlanDetails = defaultPlan[0];
      this.stepTwoForm.patchValue({
        policyStartDate: policyStartDate.format('YYYY-MM-DD'),
        selectedPlan: defaultPlan[0].plan_id,
        selectedPolicyTerm: '1'
      });

      this.formValidationService.forms();
      this.changePolicyTerm();

      this.planList.forEach((plan: any) => {
        if (!this.selectedPlanTermId) {
          let currentPlanTerm = _.filter(plan.plan_term, { 'plan_term_month': 1, 'plan_id': defaultPlan[0].plan_id, 'property_type_id': 1 });
          if (currentPlanTerm.length > 0) {
            this.selectedPlanTermId = currentPlanTerm[0].plan_terms_id;
            this.selectedPlanPrice = currentPlanTerm[0].price_below_5000_sqft
          }
        }

      });



    }, 500);
  }

  stepTwoSubmit() {
    this.stepTwoSubmitted = true
    if (!this.stepTwoForm.valid) {
      this.formValidationService.validateAllFormFields(this.stepTwoForm);
      return
    }
    this.stepper.next();
    setTimeout(() => {
      this.selectPrimaryCard();
    }, 300);

  }

  stepThreeSubmit() {
    this.stepThreeSubmitted = true
    if (!this.stepThreeForm.valid) {
      this.formValidationService.validateAllFormFields(this.stepThreeForm);
      return
    }
    this.stepper.next();
  }

  async stepFourSubmit() {
    let postData: any = {};
    postData.firstName = this.s1['firstName'].value;
    postData.lastName = this.s1['lastName'].value;
    postData.emailId = this.s1['emailId'].value;
    postData.mobileNo = this.commonSvc.convertToNormalPhoneNumber(this.s1['mobileNo'].value);
    postData.billingAddress = this.customerObj.address1;
    postData.billingZipCode = this.customerObj.zip;
    postData.billingState =  this.customerObj.state;
    postData.billingCity = this.customerObj.city;

    postData.zipCode = this.s1['propertyZipCode'].value;
    postData.state = this.s1['propertyState'].value;
    postData.city = this.s1['propertyCity'].value;
    postData.planName = this.selectedPlanDetails.plan_name;
    postData.address1 = this.s1['propertyAddressOne'].value;
    postData.planId = this.selectedPlanDetails.plan_id
    postData.policyTerm = this.selectedPolicyTermText;
    postData.policyTermMonth = this.s2['selectedPolicyTerm'].value;
    postData.planTermId = this.selectedPlanTermId;
    postData.propertyType = this.s2['propertyTypeId'].value;
    postData.propertySize = this.s2['propertySizeId'].value;
    postData.bonusMonth = this.selectedPlanBonusMonth;
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
    postData.pcfAmount = this.s2['selectedPolicyTerm'].value > 12 ? 65 : 75;
    postData.createUserType = 1;
    postData.paymentType = this.currenctPaymentType;
    postData.cardHolderName = this.s3['cardHolderName'].value ? this.s3['cardHolderName'].value : null;
    postData.cardNumber = Object.keys(this.selectedCardDetails).length != 0 ? this.selectedCardDetails.card_number : this.s3['cardNumber'].value.replace(/\s/g, "");
    postData.expiryDate = Object.keys(this.selectedCardDetails).length != 0 ? this.selectedCardDetails.card_expiry_date : this.s3['expiryDate'].value.replace(/\//g, '');
    postData.cardCode = Object.keys(this.selectedCardDetails).length != 0 ? null : this.s3['cvv'].value;
    // postData.bankAccountHolderName = this.s4['bankAccountHolderName'].value ? this.s4['bankAccountHolderName'].value : null;
    // postData.bankAccountNumber = this.s4['bankAccountNumber'].value ? this.s4['bankAccountNumber'].value : null;
    // postData.routingNumber = this.s4['routingNumber'].value ? this.s4['routingNumber'].value : null;

    const token = await this.recaptchaV3Service.execute('creetePolicyFromRealestatePro').toPromise();
    let res: any = await this.commonSvc.verifyreCaptcha(token);
    if (res.status == 1) {
      this.updateCustomerPolicyAndpayment(postData);
    }
  }

  updateCustomerPolicyAndpayment(obj: any) {
    this.loading = true;
    this.apiService.post(`${AppConfig.apiUrl.customerPortal.createPolicy}`, obj).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.status == 1) {
          window.scrollTo(0, 0);
          this.router.navigate(['/customer-portal/thankyou']);
        } else {
          this.alertService.error(response.message);
        }
      },
      error: () => { this.loading = false; },
      complete: () => { this.loading = false; }
    });
  }

  stepTwoBack() {
    this.stepper.previous();
  }

  stepThreeBack() {
    this.stepper.previous();
  }

  stepFourBack() {
    this.stepper.previous();
  }
}

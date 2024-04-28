import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../@core/services/common.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/@core/services/alert.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/@core/services/shared.service';
import { AppConfig } from '../../@utils/const/app.config';
import { ApiService } from 'src/app/@core/services/api.service';
import * as _ from "lodash";
import { UtilityService } from 'src/app/@core/services/utility.service';
import { FormValidationService } from 'src/app/@core/services/form-validation.service';
declare var Swiper: any;
@Component({
  selector: 'app-billing-payment',
  templateUrl: './billing-payment.component.html',
  styleUrls: ['./billing-payment.component.scss']
})
export class BillingPaymentComponent {
  public loading: boolean = false;
  public customerDetails: any = {};
  public customerObj: any = {};
  public primaryCardObj: any = {};
  public futurePayments: any = [];
  public previousPayments: any = [];
  public newCardForm!: FormGroup;
  public retryPaymentForm: FormGroup | any
  public creditCardModal: boolean = false;
  public retryPaymentModal: boolean = false;
  public currentFailedpaymentObj: any = {};
  public selctedCardDetails: any = {};
  public submitted: boolean = false;
  public newCardFormSubmitted: boolean = false;
  public rePaymentSubmitted: boolean = false;
  public customerCardList: any = [];


  imgSrc: any = 'assets/img/allCardIcon/credit-card.png';
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private formValidationService: FormValidationService,
    private alertService: AlertService,
    private apiSvc: ApiService,
    private sharedService: SharedService,
    private commonSvc: CommonService,
    private utilityService: UtilityService
  ) {
    this.commonSvc.setTitle('First Premier Home Warranty: Customer Portal- Billing & Payments');
    this.sharedService.sharedCustomerData$.subscribe((response: any) => {
      if (response) {
        this.customerObj = response.data;
      }
    })

    this.newCardForm = this.fb.group({
      cardHolderName: ['', [Validators.required]],
      cardNumber: ['', [Validators.required]],
      expiryDate: ['', [Validators.required, this.formValidationService.validateExpirationDateFormat, this.formValidationService.expiryDateValidator]],
      cvv: ['', [Validators.required, this.formValidationService.validateCVV]]
    });

    this.retryPaymentForm = this.fb.group({
      newCardHolderName: ['', [Validators.required]],
      newCardNumber: ['', [Validators.required]],
      newCardExpiryDate: ['', [Validators.required, this.formValidationService.validateExpirationDateFormat, this.formValidationService.expiryDateValidator]],
      newCVV: ['', [Validators.required, this.formValidationService.validateCVV]],
      newOrSavedCard: ['1'],
    })

  
  }

  get s1() { return this.newCardForm.controls; }
  get f() { return this.retryPaymentForm.controls; }

  ngOnInit(): void {
    this.getCustomerDetails();
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
  async getCustomerDetails() {
    this.customerCardList = await this.apiSvc.post(`${AppConfig.apiUrl.customerPortal.getAllCustomerCards}/${this.customerObj.customer_id}`, '').toPromise();
    this.apiSvc.post(`${AppConfig.apiUrl.customerPortal.getCustomerDetails}/${this.customerObj.customer_id}`, '').subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          this.customerDetails = response.data;
          this.customerDetails.card_list = this.customerCardList.data;
          
          this.primaryCardObj = _.filter(this.customerDetails.card_list, { 'primary_card': true });
          this.customerDetails.policy_list.forEach((element: any) => {
            this.customerDetails.payment_list.forEach((obj: any) => {
              if (element.policy_id == obj.policy_id) {
                element.future_payments = _.filter(this.customerDetails.payment_list, (payment) => {
                  return new Date(payment.payment_date) > new Date() && payment.policy_id === obj.policy_id;
                });
                element.previous_payments = _.filter(this.customerDetails.payment_list, (payment) => {
                  return new Date(payment.payment_date) < new Date() && payment.policy_id === obj.policy_id;
                });
                element.most_recent_previous_payments = element.previous_payments.sort((a: any, b: any) => b.payment_date - a.payment_date);
              }
            });
          });
          console.log('this.customerDetails', this.customerDetails);
          setTimeout(() => {
            const accItem = document.getElementsByClassName('js-acc-item') as HTMLCollectionOf<HTMLElement>;
            const accHD = document.getElementsByClassName('accordion-single-title') as HTMLCollectionOf<HTMLElement>;

            for (let i = 0; i < accHD.length; i++) {
              accHD[i].addEventListener('click', toggleItem, false);

            }

            function toggleItem(this: any) {
              const itemClass = this.parentNode?.className;

              for (let i = 0; i < accItem.length; i++) {
                accItem[i].className = 'accordion-single-item js-acc-item is-close';
              }

              if (itemClass === 'accordion-single-item js-acc-item is-close') {
                this.parentNode!.className = 'accordion-single-item js-acc-item is-open';
                let savedCardInfo = this.parentNode.querySelector('.saved_card_info_one');
                if (savedCardInfo) {
                  new Swiper(savedCardInfo, {
                    autoplay: false,
                    loop: false,
                    touchRatio: 0,
                    spaceBetween: 10,
                    slidesPerView: 1.1,
                    slidesPerGroup: 1,
                    nextButton: savedCardInfo.closest('.accdinnr_card_wrap').querySelector('.saved_card_info_one--next'),
                    prevButton: savedCardInfo.closest('.accdinnr_card_wrap').querySelector('.saved_card_info_one--prev'),
                  });
                }


                let savedCardInfo2 = this.parentNode.querySelector('.saved_card_info_two');
                if (savedCardInfo2) {
                    new Swiper(savedCardInfo2, {
                      autoplay: false,
                      loop: false,
                      touchRatio: 0,
                      spaceBetween: 10,
                      slidesPerView: 1.1,
                      slidesPerGroup: 1,
                      nextButton: savedCardInfo2.closest('.accdinnr_card_wrap').querySelector('.saved_card_info_two--next'),
                      prevButton: savedCardInfo2.closest('.accdinnr_card_wrap').querySelector('.saved_card_info_two--prev'),
                  });
                }
              }
            }



          }, 1000);
        } else {
          this.alertService.error(response.message);
        }
      }
    })
  }



  onChangeNewOrSavedCard() {
    if (this.f['newOrSavedCard'].value == 2) {
      setTimeout(() => {
        this.customerDetails.card_list.forEach((obj: any) => {
          if (obj.primary_card) {
            obj.is_active = true;
            let primaryCard: any = document.getElementById('card-' + obj.customer_card_id);
            if(primaryCard){
              primaryCard.checked = true;
            }       
          }
        });
       }, 400);
      this.selctedCardDetails = this.customerDetails?.card_list.filter((o: any) => o.primary_card == true)[0];
      if (this.selctedCardDetails) {
        this.cardImageShow(this.selctedCardDetails.card_type)
        // this.retryPaymentForm.controls['payment_type'].setValue('1');
        this.retryPaymentForm.controls['newCardNumber'].clearValidators();
        this.retryPaymentForm.controls['newCardNumber'].updateValueAndValidity();
        this.retryPaymentForm.controls['newCVV'].clearValidators();
        this.retryPaymentForm.controls['newCVV'].updateValueAndValidity();
        // this.retryPaymentForm.controls['selectedCardId'].setValue(selctedCardDetails.customer_card_id)
        this.retryPaymentForm.controls['newCardHolderName'].setValue(this.selctedCardDetails?.card_holder_name);
        this.retryPaymentForm.controls['newCardNumber'].setValue(this.selctedCardDetails?.card_last_4_digit);
        let card_expiry_date = [this.selctedCardDetails?.card_expiry_date.slice(0, 2), '/', this.selctedCardDetails?.card_expiry_date.slice(2)].join('');
        this.retryPaymentForm.controls['newCardExpiryDate'].setValue(card_expiry_date);
      }

    } else {

      this.retryPaymentForm.controls['newCardExpiryDate'].setValidators([Validators.required, this.formValidationService.validateExpirationDateFormat, this.formValidationService.expiryDateValidator]);
      this.retryPaymentForm.controls['newCardHolderName'].setValidators([Validators.required, this.formValidationService.notEmpty]);
      this.retryPaymentForm.controls['newCardNumber'].setValidators([Validators.required]);
      this.retryPaymentForm.controls['newCVV'].setValidators([Validators.required, this.formValidationService.validateCVV]);
      this.retryPaymentForm.controls['newCVV'].updateValueAndValidity();
      this.retryPaymentForm.controls['newCardNumber'].updateValueAndValidity();
      this.retryPaymentForm.controls['newCardExpiryDate'].updateValueAndValidity();
      this.retryPaymentForm.controls['newCardHolderName'].updateValueAndValidity();
      // this.retryPaymentForm.controls['selectedCardId'].setValue(null);
      this.retryPaymentForm.controls['newCardNumber'].setValue(null);
      this.retryPaymentForm.controls['newCardExpiryDate'].setValue(null);
      this.retryPaymentForm.controls['newCardHolderName'].setValue(null);
      this.retryPaymentForm.controls['newCVV'].setValue(null);
    }
    setTimeout(() => {
      this.formValidationService.forms();
    }, 200);
  }

  onChangecard(obj: any) {

    this.customerDetails?.card_list.forEach((item: any) => {
      item.is_active = false;
    });
    obj.is_active = true;
    let customer_card_id = obj.customer_card_id;
    this.selctedCardDetails = this.customerDetails?.card_list?.filter((o: any) => o.customer_card_id == customer_card_id)[0];
    this.cardImageShow(this.selctedCardDetails.card_type)
    if (this.selctedCardDetails) {
      this.retryPaymentForm.controls['newCardHolderName'].setValue(this.selctedCardDetails?.card_holder_name);
      this.retryPaymentForm.controls['newCardNumber'].setValue(this.selctedCardDetails?.card_last_4_digit);
      let card_expiry_date = [this.selctedCardDetails?.card_expiry_date.slice(0, 2), '/', this.selctedCardDetails?.card_expiry_date.slice(2)].join('');
      this.retryPaymentForm.controls['newCardExpiryDate'].setValue(card_expiry_date);
    }

  }

  cardImageShow(cardType: any) {
    switch (cardType) {
      case 'Visa':
        this.imgSrc = 'assets/img/allCardIcon/visa.svg';
        break;
      case 'MasterCard':
        this.imgSrc = 'assets/img/allCardIcon/mastercard.svg';
        break;
      case 'AmericanExpress':
        this.imgSrc = 'assets/img/allCardIcon/amex.svg';
        break;
      case 'Discover':
        this.imgSrc = 'assets/img/allCardIcon/discover.svg';
        break;
      case 'DinersClub':
        this.imgSrc = 'assets/img/allCardIcon/diners.svg';
        break;
      case 'JCB':
        this.imgSrc = 'assets/img/allCardIcon/jcb.svg';
        break;
      // Add cases for other card types as needed
      default:
        this.imgSrc = 'assets/img/allCardIcon/credit-card.png'; // Set a default image for unknown card types
    }
  }

  addNewCard() {
    this.creditCardModal = true;
    setTimeout(() => {
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
    }, 1000);
  }

  openPaymentModal(obj:any) {
    this.retryPaymentModal = true;
    this.currentFailedpaymentObj=obj;
    setTimeout(() => {
      this.formValidationService.forms();
      this.retryPaymentForm.controls['newOrSavedCard'].setValue('1');     
    }, 1000);
  }

  closeModal() {
    this.creditCardModal = false;
  }

  closePaymentModal() {
    this.retryPaymentModal = false;
  }

  submitCard() {
    this.newCardFormSubmitted = true
    if (!this.newCardForm.valid) {
      this.formValidationService.validateAllFormFields(this.newCardForm);
      return
    }

    let data = {
      emailId: this.customerObj.email,
      customerId: this.customerObj.customer_id,
      firstName: this.customerObj.first_name,
      lastName: this.customerObj.last_name,
      address1: this.customerObj.address1,
      city: this.customerObj.city,
      state: this.customerObj.state,
      zip: this.customerObj.zip,
      authorizeNetCustomerProfileId: this.customerObj.authorizeNet_customer_profile_id,
      cardHolderName: this.s1['cardHolderName'].value ? this.s1['cardHolderName'].value : null,
      cardNumber: this.s1['cardNumber'].value ? this.s1['cardNumber'].value.replace(/\s/g, '') : null,
      cardExpiryDate: this.s1['expiryDate'].value ? this.s1['expiryDate'].value.replace(/\//g, '') : null,
      cardCVV: this.s1['cvv'].value ? this.s1['cvv'].value : null,
      customerType: 1
    }
    this.loading = true;
    this.apiSvc.post(`${AppConfig.apiUrl.customerPortal.createNewCard}/${this.customerObj.customer_id}`, data).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.status == 1) {
          this.creditCardModal = false;
          this.alertService.success(response.message);
          this.newCardForm.reset();
          this.getCustomerDetails();
        } else {
          this.alertService.error(response.message);
        }
      },
      error: () => { this.loading = false; },
      complete: () => { this.loading = false; }
    })
  }

  submitPayment(){
    this.rePaymentSubmitted = true
    if (!this.retryPaymentForm.valid) {
      this.formValidationService.validateAllFormFields(this.retryPaymentForm);
      return
    }
    this.retryPaymentForm.value.cardId=this.selctedCardDetails.customer_card_id;
    this.apiSvc.post(`${AppConfig.apiUrl.customerPortal.rePayment}/${this.currentFailedpaymentObj.payment_id}`, this.retryPaymentForm.value).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          this.retryPaymentModal = false;
          this.alertService.success(response.message);
          this.retryPaymentForm.reset();
          this.getCustomerDetails();
        } else {
          this.alertService.error(response.message);
        }
      }
    })
  }
}

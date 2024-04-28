import { Component } from '@angular/core';
import { CommonService } from '../@core/services/common.service';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { FormValidationService } from '../@core/services/form-validation.service';
import { AlertService } from '../@core/services/alert.service';
import { ApiService } from '../@core/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig } from '../@utils/const/app.config';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-customer-payment-deeplink',
  templateUrl: './customer-payment-deeplink.component.html',
  styleUrls: ['./customer-payment-deeplink.component.scss']
})
export class CustomerPaymentDeeplinkComponent {
  link:any=''
  loading: boolean=false;
  policyData:any={};
  newCardFormSubmitted: boolean = false;
  newCardForm!: FormGroup;
 constructor(
    private commonSvc: CommonService,
    private fb: UntypedFormBuilder,
    private formValidationSvc: FormValidationService,
    private alertSvc: AlertService,
    private apiSvc: ApiService,
    private router: Router,
    private actvRoute: ActivatedRoute,
    private formValidationService: FormValidationService,
    private alertService: AlertService,
  ) {
    this.commonSvc.setTitle('Customer Payment Link'); 
    this.actvRoute.params.subscribe((params: any) => {
      this.link = params.link;
    });

    this.newCardForm = this.fb.group({
      cardHolderName: ['', [Validators.required]],
      cardNumber: ['', [Validators.required]],
      expiryDate: ['', [Validators.required, this.formValidationService.validateExpirationDateFormat, this.formValidationService.expiryDateValidator]],
      cvv: ['', [Validators.required, this.formValidationService.validateCVV]]
    });
  }

  ngOnInit(): void {
     this.getCustomerPaymentLinkData()
     this.expiryDate()
     setTimeout(() => {
      this.formValidationService.forms();
    }, 200);
  }

  getCustomerPaymentLinkData(){
   if (this.link) {
    const data:any= {  
      payment_link:this.link
    }      
    this.apiSvc.post(AppConfig.apiUrl.policy.getPaymentLinkData, data).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
         
          this.policyData=response.data
          if (this.policyData.payment_link_status==0) {
            this.alertService.error('Payment Already Done!');
          }
        }else{
          this.alertSvc.error(response.message);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  } else {
    this.loading = false;
    this.alertSvc.error('Invalid Link');
  }
  }

  get s1() { return this.newCardForm.controls; }

  onsubmitAddCard() {
    this.newCardFormSubmitted = true
    if (!this.newCardForm.valid) {
      this.formValidationService.validateAllFormFields(this.newCardForm);
      return
    }

    let data = {
      payment_link:this.link,
      amount:this.policyData.net_amount,
      emailId: this.policyData.email,
      customerId: this.policyData.customer_id,
      firstName: this.policyData.first_name,
      lastName: this.policyData.last_name,
      address1: this.policyData.address1,
      city: this.policyData.city,
      state: this.policyData.state,
      zip: this.policyData.zip,
      //authorizeNetCustomerProfileId: this.customerObj.authorizeNet_customer_profile_id,
      cardHolderName: this.s1['cardHolderName'].value ? this.s1['cardHolderName'].value : null,
      cardNumber: this.s1['cardNumber'].value ? this.s1['cardNumber'].value.replace(/\s/g, '') : null,
      cardExpiryDate: this.s1['expiryDate'].value ? this.s1['expiryDate'].value.replace(/\//g, '') : null,
      cardCVV: this.s1['cvv'].value ? this.s1['cvv'].value : null,
      customerType: 1
    }
    this.apiSvc.post(`${AppConfig.apiUrl.payments.linkPayment}`, data).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          // this.creditCardModal = false;
          this.router.navigate(['payment-thankyou']);
          this.newCardForm.reset();
          // this.getCustomerDetails();
        } else {
          this.alertService.error(response.message);
        }
      }
    })
  }

  expiryDate() {
    // this.creditCardModal = true;
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
}

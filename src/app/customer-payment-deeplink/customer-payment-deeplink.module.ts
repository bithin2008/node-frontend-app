import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerPaymentDeeplinkRoutingModule } from './customer-payment-deeplink-routing.module';
import { CustomerPaymentDeeplinkComponent } from './customer-payment-deeplink.component';
import { SharedModule } from '../@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CustomerPaymentDeeplinkComponent
  ],
  imports: [
    CommonModule,
    CustomerPaymentDeeplinkRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class CustomerPaymentDeeplinkModule { }

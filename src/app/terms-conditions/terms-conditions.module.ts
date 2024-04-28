import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TermsConditionsRoutingModule } from './terms-conditions-routing.module';
import { TermsConditionsComponent } from './terms-conditions.component';
import { SharedModule } from '../@shared/shared.module';


@NgModule({
  declarations: [
    TermsConditionsComponent
  ], 
  imports: [
    CommonModule,
    SharedModule,
    TermsConditionsRoutingModule
  ]
})
export class TermsConditionsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FPHWFaqRoutingModule } from './fphw-faq-routing.module';
import { FPHWFaqComponent } from './fphw-faq.component';
import { SharedModule } from '../@shared/shared.module';


@NgModule({
  declarations: [
    FPHWFaqComponent
  ],
  imports: [
    CommonModule,
    FPHWFaqRoutingModule,
    SharedModule
  ]
})
export class FPHWFaqModule { }

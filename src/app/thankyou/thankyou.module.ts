import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThankyouRoutingModule } from './thankyou-routing.module';
import { ThankyouComponent } from './thankyou.component';


@NgModule({
  declarations: [
    ThankyouComponent
  ],
  imports: [
    CommonModule,
    ThankyouRoutingModule
  ]
})
export class ThankyouModule { }

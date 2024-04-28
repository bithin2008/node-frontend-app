import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OurCoverageRoutingModule } from './our-coverage-routing.module';
import { OurCoverageComponent } from './our-coverage.component';
import { SharedModule } from '../@shared/shared.module';



@NgModule({
  declarations: [
    OurCoverageComponent
  ],
  imports: [
    CommonModule,
    OurCoverageRoutingModule,
    SharedModule
  ]
})
export class OurCoverageModule { }

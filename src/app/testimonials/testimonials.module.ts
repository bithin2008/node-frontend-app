import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestimonialsRoutingModule } from './testimonials-routing.module';
import { TestimonialsComponent } from './testimonials.component';
import { StarRatingModule } from 'angular-star-rating';
import { SharedModule } from '../@shared/shared.module';


@NgModule({
  declarations: [
    TestimonialsComponent
  ],
  imports: [
    CommonModule,
    TestimonialsRoutingModule,
    StarRatingModule.forRoot(),
    SharedModule
  ]
})
export class TestimonialsModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactUsComponent } from './contact-us.component';
import { ContactThankYouComponent } from './contact-thank-you/contact-thank-you.component';

const routes: Routes = [
  {path:'',component:ContactUsComponent},
  {path:'thank-you',component:ContactThankYouComponent}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactUsRoutingModule { }

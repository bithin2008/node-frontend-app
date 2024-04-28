import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RealtorLoginComponent } from './realtor-pre-login/realtor-login/realtor-login.component';
import { ValidateOtpComponent } from './realtor-pre-login/validate-otp/validate-otp.component';
import { ForgotPasswordComponent } from './realtor-pre-login/forgot-password/forgot-password.component';
import { EditProfileComponent } from './realtor-post-login/edit-profile/edit-profile.component';
import { ResetPasswordComponent } from './realtor-pre-login/reset-password/reset-password.component';
import { DashboardComponent } from './realtor-post-login/dashboard/dashboard.component';
import { FaqComponent } from './realtor-post-login/faq/faq.component';
import { CreatePolicyComponent } from './realtor-post-login/create-policy/create-policy.component';
import { RealtorThankyouComponent } from './realtor-post-login/realtor-thankyou/realtor-thankyou.component';
import { RealtorGuard } from '../@core/guards/realtor.guard';
import { ChangePasswordComponent } from './realtor-post-login/change-password/change-password.component';


const routes: Routes = [
  { path: '', component: RealtorLoginComponent},
  { path: 'validate-otp', component: ValidateOtpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'edit-profile', component: EditProfileComponent , canActivate: [RealtorGuard]},
  { path: 'change-password', component: ChangePasswordComponent , canActivate: [RealtorGuard]},
  { path: 'reset-password/:fogotpasstoken', component: ResetPasswordComponent},
  { path: 'dashboard', component: DashboardComponent, canActivate: [RealtorGuard]},
  { path: 'faq', component: FaqComponent, canActivate: [RealtorGuard]},
  { path: 'create-policy', component: CreatePolicyComponent, canActivate: [RealtorGuard]},
  { path: 'thank-you', component: RealtorThankyouComponent, canActivate: [RealtorGuard]},
  {
    path: '',
    redirectTo: '/realestate-professional-portal',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RealtorRoutingModule { }

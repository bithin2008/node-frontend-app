import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { AuthGuard } from '../@core/guards/auth.guard';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { BillingPaymentComponent } from './billing-payment/billing-payment.component';
import { MyCardComponent } from './my-card/my-card.component';
import { MyClaimComponent } from './my-claim/my-claim.component';
import { MyPolicyComponent } from './my-policy/my-policy.component';
import { ReferFriendComponent } from './refer-friend/refer-friend.component';
import { ReferFriendThankyouComponent } from './refer-friend/refer-friend-thankyou/refer-friend-thankyou.component';
import { FileClaimComponent } from './file-claim/file-claim.component';
import { CreateClaimComponent } from './create-claim/create-claim.component';
import { CreatePolicyComponent } from './create-policy/create-policy.component';
import { ThankyouComponent } from './thankyou/thankyou.component';

const routes: Routes = [
  { path: 'dashboard', component: CustomerDashboardComponent },
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'bill-payments', component: BillingPaymentComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'create-policy', component: CreatePolicyComponent },
  { path: 'my-cards', component: MyCardComponent },
  { path: 'my-claims', component: MyClaimComponent },
  { path: 'my-policy', component: MyPolicyComponent },
  { path: 'refer-a-friend', component: ReferFriendComponent },
  { path: 'refer-a-friend-thankyou', component: ReferFriendThankyouComponent },
  { path: 'file-claim', component: FileClaimComponent },
  { path: 'create-claim/:policyid', component: CreateClaimComponent },
  { path: 'thankyou', component: ThankyouComponent },
  {
    path: '',
    redirectTo: '/customer-portal/dashboard',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerPortalRoutingModule { }

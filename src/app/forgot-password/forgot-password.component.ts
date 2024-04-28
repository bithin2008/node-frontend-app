import { Component } from '@angular/core';
import { CommonService } from '../@core/services/common.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  constructor(
    private commonSvc: CommonService
  ) {
    this.commonSvc.setTitle('First Premier Home Warranty: Forgot password');
  }
}

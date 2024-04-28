import { Component } from '@angular/core';
import { CommonService } from '../@core/services/common.service';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.scss']
})
export class ThankyouComponent {
  constructor(
    private commonSvc: CommonService
  ) {
    this.commonSvc.setTitle('First Premier Home Warranty: Thank you');
  }
}

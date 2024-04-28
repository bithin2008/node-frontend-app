import { Component } from '@angular/core';
import { CommonService } from 'src/app/@core/services/common.service';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss']
})
export class ThankYouComponent {
  constructor(
    private commonSvc: CommonService
  ) {
    this.commonSvc.setTitle('First Premier Home Warranty: Thank you');
  }
}

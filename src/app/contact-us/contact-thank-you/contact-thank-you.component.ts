import { Component } from '@angular/core';
import { CommonService } from 'src/app/@core/services/common.service';

@Component({
  selector: 'app-contact-thank-you',
  templateUrl: './contact-thank-you.component.html',
  styleUrls: ['./contact-thank-you.component.scss']
})
export class ContactThankYouComponent {
  constructor(
    private commonSvc: CommonService
  ) {
    this.commonSvc.setTitle('First Premier Home Warranty: Thank you');
  }


}

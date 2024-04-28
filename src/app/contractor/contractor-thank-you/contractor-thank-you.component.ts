import { Component } from '@angular/core';
import { CommonService } from 'src/app/@core/services/common.service';

@Component({
  selector: 'app-contractor-thank-you',
  templateUrl: './contractor-thank-you.component.html',
  styleUrls: ['./contractor-thank-you.component.scss']
})
export class ContractorThankYouComponent {
  constructor(
    private commonSvc: CommonService
  ) {
    this.commonSvc.setTitle('First Premier Home Warranty: Thank you');
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/@core/services/common.service';


@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.scss']
})
export class ThankyouComponent {
  constructor(
    private commonSvc: CommonService,
    private router: Router,
  ) {
    this.commonSvc.setTitle('First Premier Home Warranty: Thank you');
  }

  goToHome(){
    this.router.navigate(['/customer-portal']); 
    
  }
}

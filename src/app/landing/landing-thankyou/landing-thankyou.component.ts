import { Component } from '@angular/core';
import * as moment from 'moment';
@Component({
  selector: 'app-landing-thankyou',
  templateUrl: './landing-thankyou.component.html',
  styleUrls: ['./landing-thankyou.component.scss']
})
export class LandingThankyouComponent {
  public currectYear:any='';

  constructor(){
    this.currectYear= moment().format('YYYY');
  }
}

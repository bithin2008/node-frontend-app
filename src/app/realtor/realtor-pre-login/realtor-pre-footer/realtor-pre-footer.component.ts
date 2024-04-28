import { Component } from '@angular/core';
import * as moment from 'moment';
@Component({
  selector: 'app-realtor-pre-footer',
  templateUrl: './realtor-pre-footer.component.html',
  styleUrls: ['./realtor-pre-footer.component.scss']
})
export class RealtorPreFooterComponent {
  public currectYear:any='';

  constructor(){
    this.currectYear= moment().format('YYYY');
  }

 

}

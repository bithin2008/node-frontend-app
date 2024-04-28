import { Component } from '@angular/core';
import * as moment from 'moment';
@Component({
  selector: 'app-realtor-post-footer',
  templateUrl: './realtor-post-footer.component.html',
  styleUrls: ['./realtor-post-footer.component.scss']
})
export class RealtorPostFooterComponent {
  public currectYear:any='';
  constructor(){
    this.currectYear= moment().format('YYYY');
  }

}

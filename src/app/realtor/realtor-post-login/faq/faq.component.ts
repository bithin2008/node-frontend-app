import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/@core/services/common.service';
import { UtilityService } from 'src/app/@core/services/utility.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent {
  selectedTab:number=1;
  public pageDetails: any = {};
  constructor(
    private commonSvc: CommonService,
    private utilityService: UtilityService,
    private activatedRoute: ActivatedRoute,
    private title: Title, private meta: Meta
  ){
    
    this.commonSvc.setTitle('First Premier Home Warranty: FAQ');
    this.selectedTab=1;
  }

  ngAfterViewInit() {
    this.utilityService.accordion()
  }

  selectTab(tabNum:number){
    this.selectedTab=tabNum;
  }

}

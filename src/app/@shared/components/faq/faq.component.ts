import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SharedService } from 'src/app/@core/services/shared.service';
import { UtilityService } from 'src/app/@core/services/utility.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent {
  selectedTab:number=1;
  public pageDetails:any={};
  constructor(
    private utilityService: UtilityService,
    private sharedService: SharedService,
    private title: Title, private meta: Meta
  ) {
    this.selectedTab=1;
   
  }

  ngAfterViewInit() {
    this.utilityService.accordion();
    setTimeout(() => {
      this.sharedService.sharedPageData$.subscribe((response: any) => {
        if (response) {
          this.pageDetails = response.data;
          if(this.pageDetails){
            this.title.setTitle(this.pageDetails?.title);
            this.meta.removeTag('keyword');
            this.meta.removeTag('description');
            this.meta.updateTag({ name: 'description', content: this.pageDetails?.meta_description });
            this.meta.updateTag({ name: 'keywords', content: this.pageDetails?.meta_keywords });  
            this.meta.updateTag({ name: 'script', type: 'application/ld+json', content: JSON.stringify(this.pageDetails?.schema_markup) });      
          }       
        }
      })
    }, 1000);

  }
  selectTab(tabNum:number){
    this.selectedTab=tabNum;
  }

}

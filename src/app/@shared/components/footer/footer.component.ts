import { Component, Inject, OnInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationCancel, NavigationEnd, NavigationError } from '@angular/router';
import { AppConfig } from 'src/app/@utils/const/app.config';
import * as moment from 'moment';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  copy = '';
  appVersion = '';
  buildTimestamp = '';
  currentUrl: any = '';
  public currectYear:any='';
  constructor(
    @Inject(Router) private router: Router,
  ) {
    this.router.events.subscribe((event: Event) => {

      switch (true) {
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.currentUrl = this.router.url;
        }
      }
    });


  }

  ngOnInit() {
    this.copy = AppConfig.copyrightInfo;
    this.appVersion = AppConfig.version;
    this.buildTimestamp = AppConfig.timestamp;
    this.currectYear= moment().format('YYYY');
  }

}

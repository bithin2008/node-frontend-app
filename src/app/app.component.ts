import { Component, VERSION, OnInit, Inject,PLATFORM_ID  } from '@angular/core';
import { Router, Event, NavigationStart, NavigationCancel, NavigationEnd, NavigationError } from '@angular/router';
import { LoaderService } from './@core/services/loader.service';
import { Meta, Title } from "@angular/platform-browser";
import { AppConfig } from './@utils/const/app.config';
import * as $ from 'jquery';
import { ApiService } from './@core/services/api.service';
import { AlertService } from './@core/services/alert.service';

import { SharedService } from './@core/services/shared.service';
import { environment } from "@env/environment";
import { LoadingBarService } from '@ngx-loading-bar/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  version = VERSION;
  loading = false;
  currentRoute: any = '';
  isLoaded: number;
  constructor(
    @Inject(Router) private router: Router,
    private loader: LoaderService,
    @Inject(Title) private titleService: Title,
    private meta: Meta,
    private loadingBar: LoadingBarService,
    private apiService: ApiService,
    private shrdSvc: SharedService,
   // private loadingBar: LoadingBarService,
    @Inject(PLATFORM_ID) private platformId: Object

  ) {
    //this.titleService.setTitle('MyApp - Angular');
    this.isLoaded = 0;
    this.router.events.subscribe((event: Event) => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }
      switch (true) {
        case event instanceof NavigationStart: {
         // this.loadingBar.start();
          this.loadingBar.useRef()
          break;
        }
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
         // this.loader.hide();
        //  this.loadingBar.complete();
          window.scrollTo(0, 0);         
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  public loadEverflowScript() {
    let body = <HTMLDivElement>document.body;
    let script = document.createElement('script');
    script.innerHTML = '';
    script.src = 'https://www.fmzvtrk.com/scripts/sdk/everflow.js';
    script.async = true;
    script.defer = true;
    body.appendChild(script);
  }

  ngOnInit() {   
    if (environment.production) {
      this.meta.removeTag("name='robots'");
    }

    this.router.events.subscribe((evt) => {
      if (isPlatformBrowser(this.platformId)) {
        if (!(evt instanceof NavigationEnd)) {
          return;
        }
        if (this.isLoaded == 0) {
          this.loadEverflowScript();
          this.isLoaded++;
        }
        window.scrollTo(0, 0);
      }

    });
  }

 
}

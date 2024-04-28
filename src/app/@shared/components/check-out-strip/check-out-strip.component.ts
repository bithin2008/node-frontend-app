import { Component, Inject } from '@angular/core';
import { Router, Event, NavigationStart, NavigationCancel, NavigationEnd, NavigationError } from '@angular/router';
@Component({
  selector: 'app-check-out-strip',
  templateUrl: './check-out-strip.component.html',
  styleUrls: ['./check-out-strip.component.scss']
})
export class CheckOutStripComponent {
  copy = '';
  appVersion = '';
  buildTimestamp = '';
  currentUrl: any = '';
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

  }

  navigate(){
    if (this.router.url=='/plan') { 
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }else{
      this.router.navigate(['/plan'])
    }
  }
}

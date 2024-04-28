import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/@core/services/auth.service';
import { CommonService } from 'src/app/@core/services/common.service';
import { NavigationService } from 'src/app/@core/services/navigation.service';
import { AppConfig } from 'src/app/@utils/const/app.config';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  productName = AppConfig.productName;
  user: any;
  isOpened = true;
  resolution = 'lg';
  public isVisable: boolean = false;
  constructor(private authSvc: AuthService, private navService: NavigationService, private commonSvc: CommonService, private router: Router,) {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.disableVisibility();
      }
    });
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authSvc.isLoggedIn();
    this.user = this.authSvc.getUser();
    this.resolution = this.commonSvc.getScreenResolutionBreakPoint()
  }

  ngAfterViewInit(): void {
    const header: any = document.querySelector("header");
    const toggleClass = "is-sticky";

    window.addEventListener("scroll", () => {
      const currentScroll = window.scrollY;
      if (currentScroll >= 50) {
        header.classList.add(toggleClass);
      }
      if (currentScroll <= 0) {
        header.classList.remove(toggleClass);
      }
    });

    var acc = document.getElementsByClassName("has-submenu");
    var i:any;
    if(acc){
      for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", (ev:any)=> {
         let arrow:any= ev.target.parentElement.querySelector('svg');
         if(arrow)
            arrow.classList.toggle("active");
          var panel = ev.target.nextElementSibling;
          if(panel){
            if (panel.style.maxHeight) {
              panel.style.maxHeight = null;
            } else {
              panel.style.maxHeight = panel.scrollHeight + "px";
            }
          }          
        });
      }
    }
    

  }

  enableVisibility() {
    this.isVisable = true;
  }

  disableVisibility() {
    this.isVisable = false;
  }

  toggleSideNav() {
    this.navService.showNav$.subscribe((data) => {
      this.isOpened = data;
    });
    if (!this.isOpened) {
      this.navService.showNav();
    } else {
      this.navService.hideNav();
    }
  }
}

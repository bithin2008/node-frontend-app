import { Component, OnInit, OnDestroy, Renderer2, ElementRef, HostListener } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CommonService } from 'src/app/@core/services/common.service';
import { NavigationService } from 'src/app/@core/services/navigation.service';
import * as moment from 'moment';
@Component({
  selector: 'app-authenticated-layout',
  templateUrl: './authenticated-layout.component.html',
  styleUrls: ['./authenticated-layout.component.scss']
})
export class AuthenticatedLayoutComponent implements OnInit {
  showSideNav: Observable<any> | undefined;
  isDropdownVisible = false;
  public currectYear:any='';

  constructor(private navService: NavigationService, private commonSvc: CommonService,private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    this.showSideNav = this.navService.getShowNav();
    this.currectYear= moment().format('YYYY');
  }

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isDropdownVisible = false;
    }
  }

  closeSideBar() {
    if (this.commonSvc.getScreenResolutionBreakPoint() === 'xs' || this.commonSvc.getScreenResolutionBreakPoint() === 'sm' || this.commonSvc.getScreenResolutionBreakPoint() === 'md') {
      this.navService.toggleNavState();
    }
  }
}

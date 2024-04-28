import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HighlightDirective } from './directives/highlight.directive';
import { CheckCapsLockDirective } from './directives/check-caps-lock.directive';
import { ExponentialStrengthPipe } from './pipes/exponential-strength.pipe';
import { MaskPipe } from './pipes/mask.pipe';
import { OrderByPipe } from './pipes/order-by.pipe';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { DefaultLayoutComponent } from './components/layouts/default-layout/default-layout.component';
import { UnauthenticatedLayoutComponent } from './components/layouts/unauthenticated-layout/unauthenticated-layout.component';
import { AuthenticatedLayoutComponent } from './components/layouts/authenticated-layout/authenticated-layout.component';
import { ValidationErrorComponent } from './components/validation-error/validation-error.component';
import { AlertMessageComponent } from './components/alert-message/alert-message.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LoaderComponent } from './components/loader/loader.component';
import { UiButtonComponent } from './components/ui-button/ui-button.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { StatusIndicatorDirective } from './directives/status-indicator.directive';
import { ThemeSwitchComponent } from './components/theme-switch/theme-switch.component';
import { IconComponent } from './components/icon/icon.component';
//import { CookieConsentComponent } from './components/cookie-consent/cookie-consent.component';
import { ScrollToTopComponent } from './components/scroll-to-top/scroll-to-top.component';
import { PrimeNgModule } from '../prime-ng.module';
import { AllowOnlyNumbersDirective } from './directives/allow-only-numbers.directive';
import { SvgComponent } from './svg/svg.component';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { FaqComponent } from './components/faq/faq.component';
import { CheckOutStripComponent } from './components/check-out-strip/check-out-strip.component';
import { TermsConditionsComponent } from '../terms-conditions/terms-conditions.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { UsPhoneNumberDirective } from './directives/us-phone-number.directive';
import { CustomerPortalComponent } from '../customer-portal/customer-portal.component';
import { CreditCardFormatterDirective } from './directives/credit-card-formatter.directive';
import { SlashifyPipe } from './pipes/slashify.pipe';
import { TestimoialSliderComponent } from './components/testimoial-slider/testimoial-slider.component';
import { StarRatingModule } from 'angular-star-rating';
import { NumberLengthDirective } from './directives/three-to-four-digits.directive';
import { InputLimitDirective } from './directives/input-limit.directive';

const data = [
  HighlightDirective,
  ExponentialStrengthPipe,
  MaskPipe,
  OrderByPipe,
  CheckCapsLockDirective,
  HeaderComponent,
  FooterComponent,
  ValidationErrorComponent,
  DefaultLayoutComponent,
  UnauthenticatedLayoutComponent,
  AuthenticatedLayoutComponent,
  CustomerPortalComponent,
  AlertMessageComponent,
  SidebarComponent,
  LoaderComponent,
  UiButtonComponent,
  SearchInputComponent,
  FileUploadComponent,
  StatusIndicatorDirective,
  ThemeSwitchComponent,
  IconComponent,
  //CookieConsentComponent,
  ScrollToTopComponent,
  SvgComponent,
  BlogListComponent,
  FaqComponent,
  CheckOutStripComponent,
  AllowOnlyNumbersDirective,
  InputLimitDirective,
  UsPhoneNumberDirective,
  SafeHtmlPipe,
  CreditCardFormatterDirective,
  SlashifyPipe,
  TestimoialSliderComponent,
  NumberLengthDirective
  ];

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
   // PrimeNgModule,
    StarRatingModule.forRoot(),
  ],
  declarations: [
    ...data,
    TestimoialSliderComponent    
  ],
  providers: [],
  exports: [
    ...data
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {
}

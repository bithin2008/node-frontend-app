import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './@core/guards/auth.guard';
import { DefaultLayoutComponent } from './@shared/components/layouts/default-layout/default-layout.component';
import { UnauthenticatedLayoutComponent } from './@shared/components/layouts/unauthenticated-layout/unauthenticated-layout.component';
import { AuthenticatedLayoutComponent } from './@shared/components/layouts/authenticated-layout/authenticated-layout.component';
import { ErrorPageNotFoundComponent } from './error-page-not-found/error-page-not-found.component';
import { ErrorUnauthorizedComponent } from './error-unauthorized/error-unauthorized.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { PolicyStepperComponent } from './policy-stepper/policy-stepper.component';
import { CustomerPortalComponent } from './customer-portal/customer-portal.component';
import { CustomerComponent } from './customer/customer.component';
import { RealtorComponent } from './realtor/realtor.component';
import { LandingComponent } from './landing/landing.component';
import { CustomerPaymentDeeplinkComponent } from './customer-payment-deeplink/customer-payment-deeplink.component';
import { LinkPaymentThankYouComponent } from './link-payment-thank-you/link-payment-thank-you.component';
import { RouteResolver } from './@core/services/route-resolver.service';

// Routing with lazy loading
const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),    
         resolve: {
          routeData: RouteResolver, 
        },
      },
      {
        path: 'plan',
        loadChildren: () => import('./plans/plans.module').then(m => m.PlansModule),
        resolve: {
          routeData: RouteResolver,
        },
      },
      {
        path: 'our-coverage',
        loadChildren: () => import('./our-coverage/our-coverage.module').then(m => m.OurCoverageModule),
        resolve: {
          routeData: RouteResolver,
        },
      },
      {
        path: 'blogs',
        loadChildren: () => import('./blogs/blogs.module').then(m => m.BlogsModule),
        resolve: {
          routeData: RouteResolver,
        },
      },
      {
        path: 'checkout',
        loadChildren: () => import('./policy-stepper/policy-stepper.module').then(m => m.PolicyStepperModule)
      },
      {
        path: 'thankyou',
        loadChildren: () => import('./thankyou/thankyou.module').then(m => m.ThankyouModule)
      },
      {
        path: 'payment-thankyou',
        component: LinkPaymentThankYouComponent
      },
      {
        path: 'about-us',
        loadChildren: () => import('./about-us/about-us.module').then(m => m.AboutUsModule),
        resolve: {
          routeData: RouteResolver,
        },
      },
      {
        path: 'affiliates',
        loadChildren: () => import('./affiliates/affiliates.module').then(m => m.AffiliatesModule),
        resolve: {
          routeData: RouteResolver,
        },
      },
      {
        path: 'contractors',
        loadChildren: () => import('./contractor/contractor.module').then(m => m.ContractorModule),
        resolve: {
          routeData: RouteResolver,
        },
      },
      {
        path: 'real-estate-professionals',
        loadChildren: () => import('./real-estate/real-estate.module').then(m => m.RealEstateModule),
        resolve: {
          routeData: RouteResolver,
        },
      },
      {
        path: 'career',
        loadChildren: () => import('./career/career.module').then(m => m.CareerModule),
        resolve: {
          routeData: RouteResolver,
        },
      },
      {
        path: 'faq',
        loadChildren: () => import('./fphw-faq/fphw-faq.module').then(m => m.FPHWFaqModule),
        resolve: {
          routeData: RouteResolver,
        },
      },
      {
        path: 'testimonials',
        loadChildren: () => import('./testimonials/testimonials.module').then(m => m.TestimonialsModule),
        resolve: {
          routeData: RouteResolver,
        },
      },
      {
        path: 'privacy-policy',
        loadChildren: () => import('./privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyModule),
        resolve: {
          routeData: RouteResolver,
        },
      },
      {
        path: 'contact-us',
        loadChildren: () => import('./contact-us/contact-us.module').then(m => m.ContactUsModule),
        resolve: {
          routeData: RouteResolver,
        },
      },
      {
        path: 'terms-conditions',
        loadChildren: () => import('./terms-conditions/terms-conditions.module').then(m => m.TermsConditionsModule),
        resolve: {
          routeData: RouteResolver,
        },
      },
      {
        path: 'forgot-password',
        loadChildren: () => import('./forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule)
      },
      {
        path: 'forgot-password',
        loadChildren: () => import('./forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule)
      }
    ]
  },

  // {
  //   path: '',
  //   redirectTo: '/dashboard',
  //   pathMatch: 'full'
  // },
  // {
  //   path: '',
  //   component: UnauthenticatedLayoutComponent,
  //   children: [
  //     {
  //       path: 'auth',
  //       loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  //     }
  //   ]
  // },
  // {
  //   path: 'user/login',
  //   pathMatch: 'full',
  //   redirectTo: 'auth/login'
  // },
  // {
  //   path: '',
  //   component: DefaultLayoutComponent,
  //   children: [
  //     {
  //       path: 'example',
  //       loadChildren: () => import('./ng-example/ng-example.module').then(m => m.NgExampleModule)
  //     }
  //   ]
  // },
  {
    path: 'customer-portal',
    component: CustomerPortalComponent,
    canActivate: [AuthGuard],    
    children: [
      {
        path: '',
        
        loadChildren: () => import('./customer-portal/customer-portal.module').then(m => m.CustomerPortalModule)
      }
      // {
      //   path: 'change-password',
      //   loadChildren: () => import('./customer-portal/change-password/change-password.module').then(m => m.ChangePasswordModule)
      // },
      // {
      //   path: 'billing-payment',
      //   loadChildren: () => import('./customer-portal/billing-payment/billing-payment.module').then(m => m.BillingAndPaymentModule)
      // },
      // {
      //   path: 'edit-profile',
      //   loadChildren: () => import('./customer-portal/edit-profile/edit-profile.module').then(m => m.EditProfileModule)
      // },
      // {
      //   path: 'my-claim',
      //   loadChildren: () => import('./customer-portal/my-claim/my-claim.module').then(m => m.MyClaimModule)
      // },
      // {
      //   path: 'my-card',
      //   loadChildren: () => import('./customer-portal/my-card/my-card.module').then(m => m.MyCardModule)
      // }
    ]
  },

  {
    path: 'customer',
    component: CustomerComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule)
      }
    ]
  },

  {
    path: 'realestate-professional-portal',
    component: RealtorComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./realtor/realtor.module').then(m => m.RealtorModule)
      }
    ]
  },
  {
    path: 'home-warranty-quotes',
    component: LandingComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule)
      }
    ],
    // resolve: {
    //   routeData: RouteResolver,
    // },
  },
  {
    path: 'customer-payment-deeplink/:link',
    component: CustomerPaymentDeeplinkComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./customer-payment-deeplink/customer-payment-deeplink.module').then(m => m.CustomerPaymentDeeplinkModule)
      }
    ]
  },
  {
    path: 'error',
    component: ErrorPageComponent
  },
  {
    path: 'unauthorized',
    component: ErrorUnauthorizedComponent
  },
  {
    path: '**', // wildcard will be at always last
    component: ErrorPageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})]
})
export class AppRoutingModule { }

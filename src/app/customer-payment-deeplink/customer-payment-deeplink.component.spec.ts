import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPaymentDeeplinkComponent } from './customer-payment-deeplink.component';

describe('CustomerPaymentDeeplinkComponent', () => {
  let component: CustomerPaymentDeeplinkComponent;
  let fixture: ComponentFixture<CustomerPaymentDeeplinkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerPaymentDeeplinkComponent]
    });
    fixture = TestBed.createComponent(CustomerPaymentDeeplinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

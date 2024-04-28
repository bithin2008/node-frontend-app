import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkPaymentThankYouComponent } from './link-payment-thank-you.component';

describe('LinkPaymentThankYouComponent', () => {
  let component: LinkPaymentThankYouComponent;
  let fixture: ComponentFixture<LinkPaymentThankYouComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkPaymentThankYouComponent]
    });
    fixture = TestBed.createComponent(LinkPaymentThankYouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

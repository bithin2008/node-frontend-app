import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliatesThankYouComponent } from './affiliates-thank-you.component';

describe('AffiliatesThankYouComponent', () => {
  let component: AffiliatesThankYouComponent;
  let fixture: ComponentFixture<AffiliatesThankYouComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffiliatesThankYouComponent]
    });
    fixture = TestBed.createComponent(AffiliatesThankYouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

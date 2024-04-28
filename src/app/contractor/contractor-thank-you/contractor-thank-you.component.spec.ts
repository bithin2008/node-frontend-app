import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorThankYouComponent } from './contractor-thank-you.component';

describe('ContractorThankYouComponent', () => {
  let component: ContractorThankYouComponent;
  let fixture: ComponentFixture<ContractorThankYouComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContractorThankYouComponent]
    });
    fixture = TestBed.createComponent(ContractorThankYouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

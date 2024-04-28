import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyStepperComponent } from './policy-stepper.component';

describe('PolicyStepperComponent', () => {
  let component: PolicyStepperComponent;
  let fixture: ComponentFixture<PolicyStepperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PolicyStepperComponent]
    });
    fixture = TestBed.createComponent(PolicyStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

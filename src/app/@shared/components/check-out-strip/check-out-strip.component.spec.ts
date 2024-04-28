import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckOutStripComponent } from './check-out-strip.component';

describe('CheckOutStripComponent', () => {
  let component: CheckOutStripComponent;
  let fixture: ComponentFixture<CheckOutStripComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckOutStripComponent]
    });
    fixture = TestBed.createComponent(CheckOutStripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

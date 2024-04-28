import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurCoverageComponent } from './our-coverage.component';

describe('OurCoverageComponent', () => {
  let component: OurCoverageComponent;
  let fixture: ComponentFixture<OurCoverageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OurCoverageComponent]
    });
    fixture = TestBed.createComponent(OurCoverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

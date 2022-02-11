import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LongStatisticComponent } from './long-statistic.component';

describe('LongStatisticComponent', () => {
  let component: LongStatisticComponent;
  let fixture: ComponentFixture<LongStatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LongStatisticComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LongStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

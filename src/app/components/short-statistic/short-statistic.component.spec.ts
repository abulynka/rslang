import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortStatisticComponent } from './short-statistic.component';

describe('ShortStatisticComponent', () => {
  let component: ShortStatisticComponent;
  let fixture: ComponentFixture<ShortStatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShortStatisticComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

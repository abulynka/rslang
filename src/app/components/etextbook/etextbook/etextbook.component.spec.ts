import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtextbookComponent } from './etextbook.component';

describe('EtextbookComponent', () => {
  let component: EtextbookComponent;
  let fixture: ComponentFixture<EtextbookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EtextbookComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EtextbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

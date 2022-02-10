import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesStartComponent } from './games-start.component';

describe('GamesStartComponent', () => {
  let component: GamesStartComponent;
  let fixture: ComponentFixture<GamesStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GamesStartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GamesStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

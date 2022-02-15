import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintGameComponent } from './sprint-game.component';

describe('SprintGameComponent', () => {
  let component: SprintGameComponent;
  let fixture: ComponentFixture<SprintGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SprintGameComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SprintGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

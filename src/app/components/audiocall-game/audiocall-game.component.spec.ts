import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudiocallGameComponent } from './audiocall-game.component';

describe('AudiocallGameComponent', () => {
  let component: AudiocallGameComponent;
  let fixture: ComponentFixture<AudiocallGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudiocallGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudiocallGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { CheckAuthGuard } from './check-auth.guard';

describe('CheckAuthGuard', () => {
  let guard: CheckAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CheckAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

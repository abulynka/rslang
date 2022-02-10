import { TestBed } from '@angular/core/testing';

import { SignInService } from './sign-in.service';

describe('SigninService', () => {
  let service: SignInService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignInService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

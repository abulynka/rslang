import { TestBed } from '@angular/core/testing';

import { UserWordsService } from './user-words.service';

describe('UserWordsService', () => {
  let service: UserWordsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserWordsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

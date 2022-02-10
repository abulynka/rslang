import { TestBed } from '@angular/core/testing';

import { UsersWordsService } from './users-words.service';

describe('UsersWordsService', () => {
  let service: UsersWordsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersWordsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { GamesStatesService } from './games-states.service';

describe('GamesStatesService', () => {
  let service: GamesStatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GamesStatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

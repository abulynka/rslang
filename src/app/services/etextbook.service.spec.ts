import { TestBed } from '@angular/core/testing';

import { EtextbookService } from './etextbook.service';

describe('EtextbookService', () => {
  let service: EtextbookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EtextbookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

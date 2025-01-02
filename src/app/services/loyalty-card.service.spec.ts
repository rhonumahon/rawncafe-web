import { TestBed } from '@angular/core/testing';

import { LoyaltyCardService } from './loyalty-card.service';

describe('LoyaltyCardService', () => {
  let service: LoyaltyCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoyaltyCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

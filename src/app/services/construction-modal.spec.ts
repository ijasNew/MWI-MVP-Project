import { TestBed } from '@angular/core/testing';

import { ConstructionModal } from './construction-modal';

describe('ConstructionModal', () => {
  let service: ConstructionModal;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConstructionModal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ProfileCompletionService } from './profile-completion';

describe('ProfileCompletion', () => {
  let service: ProfileCompletionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileCompletionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

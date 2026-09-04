import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { InterestService } from './interest';

describe('InterestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [InterestService, provideHttpClient()] });
  });

  it('should be created', () => {
    expect(TestBed.inject(InterestService)).toBeTruthy();
  });
});

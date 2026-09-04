import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProfileService } from './profile';

describe('ProfileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ProfileService, provideHttpClient()] });
  });

  it('should be created', () => {
    expect(TestBed.inject(ProfileService)).toBeTruthy();
  });
});

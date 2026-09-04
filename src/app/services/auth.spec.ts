import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        { provide: Router, useValue: {} }
      ]
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(AuthService)).toBeTruthy();
  });
});

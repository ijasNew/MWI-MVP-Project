import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth-guard';
import { ApiService } from '../services/api';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: {} },
        { provide: ApiService, useValue: {} }
      ]
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(AuthGuard)).toBeTruthy();
  });
});

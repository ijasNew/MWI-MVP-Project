import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AdminAuthGuard } from './admin-auth-guard';
import { AuthService } from '../services/auth';

describe('AdminAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdminAuthGuard,
        { provide: Router, useValue: {} },
        { provide: AuthService, useValue: {} }
      ]
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(AdminAuthGuard)).toBeTruthy();
  });
});

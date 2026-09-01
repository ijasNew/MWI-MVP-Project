import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { Injector } from '@angular/core';

import { AdminAuthGuard } from './admin-auth-guard';

describe('adminAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => {
      const guard = new AdminAuthGuard(TestBed.inject(Injector));
      return guard.canActivate(...guardParameters);
    });

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

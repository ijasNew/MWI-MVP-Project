import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationDbCheck } from './registration-db-check';

describe('RegistrationDbCheck', () => {
  let component: RegistrationDbCheck;
  let fixture: ComponentFixture<RegistrationDbCheck>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationDbCheck],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationDbCheck);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

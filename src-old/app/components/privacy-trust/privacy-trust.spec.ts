import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyTrust } from './privacy-trust';

describe('PrivacyTrust', () => {
  let component: PrivacyTrust;
  let fixture: ComponentFixture<PrivacyTrust>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyTrust],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyTrust);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

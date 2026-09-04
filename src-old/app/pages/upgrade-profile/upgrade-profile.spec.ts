import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradeProfile } from './upgrade-profile';

describe('UpgradeProfile', () => {
  let component: UpgradeProfile;
  let fixture: ComponentFixture<UpgradeProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpgradeProfile],
    }).compileComponents();

    fixture = TestBed.createComponent(UpgradeProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

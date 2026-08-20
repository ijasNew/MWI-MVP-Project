import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchingProfiles } from './matching-profiles';

describe('MatchingProfiles', () => {
  let component: MatchingProfiles;
  let fixture: ComponentFixture<MatchingProfiles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchingProfiles],
    }).compileComponents();

    fixture = TestBed.createComponent(MatchingProfiles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

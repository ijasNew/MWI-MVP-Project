import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyDetails } from './family-details';

describe('FamilyDetails', () => {
  let component: FamilyDetails;
  let fixture: ComponentFixture<FamilyDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilyDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(FamilyDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

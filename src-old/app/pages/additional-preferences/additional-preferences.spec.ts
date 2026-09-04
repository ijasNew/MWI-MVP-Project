import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalPreferences } from './additional-preferences';

describe('AdditionalPreferences', () => {
  let component: AdditionalPreferences;
  let fixture: ComponentFixture<AdditionalPreferences>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdditionalPreferences],
    }).compileComponents();

    fixture = TestBed.createComponent(AdditionalPreferences);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

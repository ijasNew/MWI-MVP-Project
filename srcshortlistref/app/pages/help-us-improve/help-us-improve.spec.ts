import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpUsImprove } from './help-us-improve';

describe('HelpUsImprove', () => {
  let component: HelpUsImprove;
  let fixture: ComponentFixture<HelpUsImprove>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpUsImprove],
    }).compileComponents();

    fixture = TestBed.createComponent(HelpUsImprove);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

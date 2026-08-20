import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Shortlisted } from './shortlisted';

describe('Shortlisted', () => {
  let component: Shortlisted;
  let fixture: ComponentFixture<Shortlisted>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shortlisted],
    }).compileComponents();

    fixture = TestBed.createComponent(Shortlisted);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

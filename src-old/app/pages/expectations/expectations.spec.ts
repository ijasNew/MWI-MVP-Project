import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Expectations } from './expectations';

describe('Expectations', () => {
  let component: Expectations;
  let fixture: ComponentFixture<Expectations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Expectations],
    }).compileComponents();

    fixture = TestBed.createComponent(Expectations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

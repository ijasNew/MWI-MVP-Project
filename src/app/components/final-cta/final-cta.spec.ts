import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { FinalCta } from './final-cta';

describe('FinalCta', () => {
  let component: FinalCta;
  let fixture: ComponentFixture<FinalCta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalCta],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FinalCta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkDetails } from './work-details';

describe('WorkDetails', () => {
  let component: WorkDetails;
  let fixture: ComponentFixture<WorkDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

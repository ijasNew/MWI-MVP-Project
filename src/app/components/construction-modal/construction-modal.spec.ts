import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructionModal } from './construction-modal';

describe('ConstructionModal', () => {
  let component: ConstructionModal;
  let fixture: ComponentFixture<ConstructionModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConstructionModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ConstructionModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

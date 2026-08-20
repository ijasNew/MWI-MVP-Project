import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePhotos } from './profile-photos';

describe('ProfilePhotos', () => {
  let component: ProfilePhotos;
  let fixture: ComponentFixture<ProfilePhotos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePhotos],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePhotos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

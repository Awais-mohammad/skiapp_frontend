import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursePackageRegistrationConfirmPage } from './course-package-registration-confirm.page';

describe('CoursePackageRegistrationConfirmPage', () => {
  let component: CoursePackageRegistrationConfirmPage;
  let fixture: ComponentFixture<CoursePackageRegistrationConfirmPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursePackageRegistrationConfirmPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursePackageRegistrationConfirmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

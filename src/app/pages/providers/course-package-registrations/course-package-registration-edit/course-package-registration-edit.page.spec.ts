import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursePackageRegistrationEditPage } from './course-package-registration-edit.page';

describe('CoursePackageRegistrationEditPage', () => {
  let component: CoursePackageRegistrationEditPage;
  let fixture: ComponentFixture<CoursePackageRegistrationEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursePackageRegistrationEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursePackageRegistrationEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

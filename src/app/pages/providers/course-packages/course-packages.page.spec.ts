import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursePackagesPage } from './course-packages.page';

describe('CoursePackagesPage', () => {
  let component: CoursePackagesPage;
  let fixture: ComponentFixture<CoursePackagesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursePackagesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursePackagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

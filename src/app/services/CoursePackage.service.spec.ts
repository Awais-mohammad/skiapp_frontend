import { TestBed } from '@angular/core/testing';

import { CoursePackageService } from './CoursePackage.service';

describe('CoursePackageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoursePackageService = TestBed.get(CoursePackageService);
    expect(service).toBeTruthy();
  });
});

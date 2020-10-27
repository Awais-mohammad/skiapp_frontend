import { TestBed } from '@angular/core/testing';

import { PackagePaymentService } from './package-payment.service';

describe('PackagePaymentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PackagePaymentService = TestBed.get(PackagePaymentService);
    expect(service).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPaymentPage } from './test-payment.page';

describe('TestPaymentPage', () => {
  let component: TestPaymentPage;
  let fixture: ComponentFixture<TestPaymentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestPaymentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestPaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

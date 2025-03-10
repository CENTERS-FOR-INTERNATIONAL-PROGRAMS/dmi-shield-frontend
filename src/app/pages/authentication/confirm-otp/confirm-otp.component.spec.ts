import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmOtpComponent } from './confirm-otp.component';

describe('ConfirmOtpComponent', () => {
  let component: ConfirmOtpComponent;
  let fixture: ComponentFixture<ConfirmOtpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmOtpComponent],
    });
    fixture = TestBed.createComponent(ConfirmOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

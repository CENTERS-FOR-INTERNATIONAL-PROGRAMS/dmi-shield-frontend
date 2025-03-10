import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompositeComponent } from './composite.component';

describe('CompositeComponent', () => {
  let component: CompositeComponent;
  let fixture: ComponentFixture<CompositeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompositeComponent],
    });
    fixture = TestBed.createComponent(CompositeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

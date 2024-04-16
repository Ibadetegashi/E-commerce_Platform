import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnavailableProductsModalComponent } from './unavailable-products-modal.component';

describe('UnavailableProductsModalComponent', () => {
  let component: UnavailableProductsModalComponent;
  let fixture: ComponentFixture<UnavailableProductsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnavailableProductsModalComponent]
    });
    fixture = TestBed.createComponent(UnavailableProductsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unavailable-products-modal',
  templateUrl: './unavailable-products-modal.component.html',
  styleUrls: ['./unavailable-products-modal.component.scss']
})
export class UnavailableProductsModalComponent {
  @Input() orderItemsWithoutStock: any[] = [];
   @Input() existingCartItems: any[] = [];

    constructor(private cartService: CartService, private router: Router) {}

 

     continueAddingToCart() {
    this.cartService.reorder(this.existingCartItems).subscribe((res) => {
        console.log(res);
        this.cartService.cart$.next(this.existingCartItems);
    this.router.navigate(['/cart'])
    }, err => {
        console.log(err);
    });
  }
}

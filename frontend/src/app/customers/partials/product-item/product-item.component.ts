import { Component, Input } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent {
  @Input() product: any
  quantity = 1
  constructor(private cartService: CartService) { }


  // addToCart() {
  //   const items = {
  //     productId: this.product.id,
  //     quantity: this.quantity
  //   }
  //    this.cartService.setCartItem(items);
  // }

  addToCart() {
    this.cartService.addItemToCart(this.product.id, this.quantity, false)
  }
}

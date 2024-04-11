import { Component, Input, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {
  @Input() product: any
  quantity = 1
  availableStock = 0
  constructor(private cartService: CartService) {
   
  }
  ngOnInit(): void {
    this.cartService.cart$.subscribe((cart: any[]) => {
      if (this.product) {
        const cartItem = cart.find(item => item.productId === this.product.id);
        if (cartItem && cartItem.quantit >= this.product.stock) {
          this.product.stock = 0;
        }
      }
    });
  }


  addToCart() {
    this.cartService.addItemToCart(this.product.id, this.quantity, false);
  }
}

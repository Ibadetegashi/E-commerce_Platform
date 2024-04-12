import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { ProductService } from 'src/app/auth/services/product.service';
import { OrderService } from '../../services/order.service';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  quantity: any
  cartWithProduct: any[] = []
  cartCount = 0
  totalPrices = 0
  canAdd = true
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private messageService: MessageService) {
    this.getCartDetails()
    this.totalPriceOfCart()
  }

getCartDetails() {
  this.cartService.cart$.subscribe((carts: any) => {
    console.log('carts', carts);
     this.cartCount = carts?.length ?? 0;
     this.cartWithProduct = [];

    const getProductObservables = carts.map((cart: any) =>
      this.orderService.getProduct(cart.productId)
    );

    forkJoin(getProductObservables).subscribe((products: any) => {
      products.forEach((product: any, index: number) => {
        product.data.quantit = carts[index].quantit;
        this.cartWithProduct.push(product.data);
      });
    });
  });
}
  deleteItem(cart: any) {
    this.cartService.deleteItem(cart.id).subscribe((res: any) => {
      console.log(res.message);
         this.messageService.add(
          {
            severity: 'success',
            summary: 'Success',
            detail: res.message
           });
      console.log('res.newCart.items', res.newCart.items);
      this.cartService.cart$.next(res.newCart.items)
    }, err => {
      console.log(err);
     })
  }

  totalPriceOfCart() {
    this.cartService.cart$.subscribe((cartItems: any) => {
      this.totalPrices = 0
      cartItems.forEach((item: any) => {
        this.orderService.getProduct(item.productId).subscribe((product: any) => {
          const price = item.quantit * product.data.price;
          this.totalPrices += price
        })
      })
    })
  }

  changeQuantity(event: any, cartItem: any) {
    
    cartItem.stock < event.value ? this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Not enough stock!'
         }) : this.cartService.addItemToCart(cartItem.id, event.value, true)
  }
}
  


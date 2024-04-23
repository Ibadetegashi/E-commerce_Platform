import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { MessageService } from 'primeng/api';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  product: any
  id!: number
  quantity = 1
  cart!: any[]
  selectedImg: any = ''
  

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private cartService: CartService,
    private messageService: MessageService
  ) {
    this.activatedRoute.params.subscribe((data: any) => {
      this.id = data.id;
    });
    orderService.getProduct(this.id).subscribe((res: any) => { 
      this.product = res.data;
      this.selectedImg = this.product.image
    });
  }
  ngOnInit(): void {
    this.cartService.cart$.subscribe((cart: any) => {
      this.cart = cart
    })
  }

  addProductToCart() {
    const productInCart = this.cart.find((p: any) => p.productId === this.product.id)
    if (productInCart) {
      productInCart.quantity + this.quantity > this.product.stock ? this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Not enough stock!'
      }) :  this.cartService.addItemToCart(this.id, this.quantity, false);
    } else {
      this.quantity > this.product.stock ?  this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Not enough stock!'
      }) : this.cartService.addItemToCart(this.id, this.quantity, false);
    }
  }

  selectImg(img: any) {
   this.selectedImg = img.url 
   
  }
  
 isActive(img: any): boolean {
   return this.selectedImg === img.url;
}


}

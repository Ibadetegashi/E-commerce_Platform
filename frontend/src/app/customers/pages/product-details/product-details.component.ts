import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { MessageService } from 'primeng/api';
import { ReviewService } from '../../services/review.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  product: any
  id!:number 
  quantity = 1
  cart!: any[]
  selectedImg: any = ''
  suggestedProducts:any[] = []
  

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private cartService: CartService,
    private messageService: MessageService
  ) {
   
  }
  ngOnInit(): void {
    this.cartService.cart$.subscribe((cart: any) => {
      this.cart = cart
    })
        this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.id = +params.get('id')!;
        return this.orderService.getProduct(this.id);
      })
    ).subscribe((res: any) => {
      this.product = res.data;
      this.selectedImg = this.product.image;
      this.getSuggestedProducts();
       window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    
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
  
  getSuggestedProducts() {
    this.orderService.getSuggestedProducts(this.product.Category.id).subscribe((response: any) => { 
      console.log(response);
      this.suggestedProducts = response.data;
    })
  }


}

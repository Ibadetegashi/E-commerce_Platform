import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/auth/services/product.service';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { Product } from 'src/app/shared/interfaces/product';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent {
  product$?: Observable<Product>
  id!: number
  quantity = 1
  constructor(
    private activatedRoute: ActivatedRoute,
    productService: ProductService,
    private cartService: CartService
  ) {
    this.activatedRoute.params.subscribe((data: any) => {
      this.id = data.id;
    })
    if (this.id) {
    this.product$ = productService.getProduct(this.id)
    }    
  }

  addProductToCart() {
    this.cartService.addItemToCart(this.id, this.quantity,false)
  }
}

import { Component, OnDestroy } from '@angular/core';
import { Subject, catchError, interval, map, take, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ProductService } from 'src/app/auth/services/product.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent {

  products$ = this.productService.getProducts()
  constructor(private productService: ProductService) {
    this.products$.subscribe((products) => {
      console.log('prooooo',products);
    })
    
  }
}

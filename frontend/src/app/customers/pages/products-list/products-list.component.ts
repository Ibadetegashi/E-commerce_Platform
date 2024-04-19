import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { PaginatorState } from 'primeng/paginator';
import { ProductService } from 'src/app/auth/services/product.service';
import { HeaderComponent } from '../../partials/header/header.component';
import { ActivatedRoute, Route } from '@angular/router';
@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit{
  @Input() name = '';
  categoryId!: number
  products: any[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  search= ''
 

  constructor(private productService: ProductService, route: ActivatedRoute) {
    route.queryParams.subscribe(params => {
      this.search = params['search'] || '';
      this.loadProducts();
    });
  }
  
  ngOnInit(): void {
    this.loadProducts();
    
  }

loadProducts(): void {
 this.productService.getProductsPagination(this.currentPage, this.pageSize, this.search)
    .subscribe((response: any) => {
      this.products = response.data;
      this.totalRecords = response.totalRecords;
      console.log('Product List : ', this.products);
    }, err => {
      console.log(err);
    });
  }

  onPageChange(event: any): void {
    console.log(event);
    this.pageSize = event.rows;
    this.currentPage = event.page + 1;

    this.loadProducts();
  }


}

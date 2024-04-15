import { Component, OnDestroy, OnInit } from '@angular/core';
import { PaginatorState } from 'primeng/paginator';
import { ProductService } from 'src/app/auth/services/product.service';
@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit{
  categoryId!: number
   products: any[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;

  constructor(private productService: ProductService) {
 
  }
  ngOnInit(): void {
    this.loadProducts();
  }

loadProducts(): void {
 this.productService.getProductsPagination(this.currentPage, this.pageSize)
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

//   console.log(event);
//    {
//     "page": 0,
//     "first": 0,
//     "rows": 5,
//     "pageCount": 3
// }

}

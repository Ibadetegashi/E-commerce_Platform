import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { PaginatorState } from 'primeng/paginator';
import { ProductService } from 'src/app/auth/services/product.service';
import { HeaderComponent } from '../../partials/header/header.component';
import { ActivatedRoute, Route } from '@angular/router';
import { CategoryService } from 'src/app/auth/services/category.service';
import { Observable } from 'rxjs';
import { Category } from 'src/app/shared/interfaces/category';

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
  pageSize: number = 12;
  search= ''
  selectedCategory: any;
  categoryOptions$!: Observable<Category[]>
  rangeValues: number[] = [0,9000]; 
  minPrice: number = 0;
  maxPrice: number = 9000;
  message: string = '';

 

  constructor(private productService: ProductService, private route: ActivatedRoute, private categoryService: CategoryService) {
  }
  ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
      this.search = params['search'] || '';
      this.loadProducts(this.selectedCategory?.id || -1,this.rangeValues );
    });
    this.categoryOptions$ = this.categoryService.getCategories()
    this.loadProducts(); 
  }

  loadProducts(categoryId: number = -1, price: number[] = []): void {
    this.message = ''
    this.productService.getProductsPagination(this.currentPage, this.pageSize, this.search, categoryId, price)
    .subscribe((response: any) => {
      this.products = response.data;
      this.totalRecords = response.totalRecords;
      console.log('totalRecords',this.totalRecords);
      console.log('Product List : ', this.products);
    }, err => {
      console.log(err);
      this.message = err.error.message
      this.products = []
    });
  }

  onPageChange(event: any): void {
    console.log(event);
    this.pageSize = event.rows;
    this.currentPage = event.page + 1;
    this.loadProducts(this.selectedCategory?.id || -1,this.rangeValues );
  }

  applyFilters() {
    this.currentPage = 1
    this.loadProducts(this.selectedCategory?.id || -1,this.rangeValues)
  }
  
  selectId(event: any) {
    this.selectedCategory = event.value
    console.log(this.selectedCategory);
  }

  removeFilters() {
    this.loadProducts(-1, [0-9000] )

}
onRangeValuesChange($event: any) {
  this.rangeValues = $event.values 
  console.log(this.rangeValues);
}
}

import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { ProductService } from 'src/app/auth/services/product.service';
import { Product } from 'src/app/shared/interfaces/product';

@Component({
  selector: 'admin-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  products$: Observable<Product[]>
  constructor(
    private productService: ProductService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.products$ = productService.getProducts()
  }

 
  
  deleteProduct(id: number) {
     this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Product?',
      header: 'Delete Product',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productService
          .deleteProduct(id)
          .subscribe(
            (res:any) => {
              this.products$ = this.productService.getProducts()
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: res.message
              });
            },
            (err) => {
              console.log(err);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Product is not deleted!'
              });
            }
          );
      }
    });
  }
}

import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { CategoryService } from 'src/app/auth/services/category.service';
import { Category } from 'src/app/shared/interfaces/category';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent {

  categories$!: Observable<Category[]>

  constructor(
    private categoryService: CategoryService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.categories$ = categoryService.getCategories()
   }
  

  
  deleteCategory(id: number) {
     this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Category?',
      header: 'Delete Category',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoryService
          .deleteCategory(id)
          .subscribe(
            (res: any) => {
             this.categories$ = this.categoryService.getCategories()  
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: res.message
              });
            },
            () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Category is not deleted!'
              });
            }
          );
      }
    });
  }
}

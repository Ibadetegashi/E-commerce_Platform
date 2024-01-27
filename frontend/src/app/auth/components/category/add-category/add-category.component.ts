import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';
import { CategoryService } from 'src/app/auth/services/category.service';
import { Category } from 'src/app/shared/interfaces/category';


@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit{
  
  form!: FormGroup
  error: any 
  isEditMode  = false
  constructor(
    private activeRoute: ActivatedRoute,
    private messageService: MessageService,
    private categoryService: CategoryService
  ) { 
 
  }
  ngOnInit(): void {
    this.form = new FormGroup({
    name:new FormControl('') 
    })
    this.checkMode() 
  }
  
  createCategory() {
    const newCategory: Category = {
    name: this.form.value.name
  };

    this.categoryService.setCategory(newCategory).subscribe((res: any) => {
       this.error = ''
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `${res.message}`
        });
    }, err => {
      this.error = err.error.errors
         this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Category is not created!'
         });
      
    }
    )
  }

  editCategory() {
    const id = this.activeRoute.snapshot.paramMap.get("id") 
    if (id) {
      const editCategory: Category = {
       id:parseInt(id),
       name: this.form.value.name
  };
      this.categoryService.editCategory(editCategory).subscribe((res: any) => {
        console.log(res);
        this.error = ''
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `${res.message}`
        });
    }, err => {
        console.log(err);
        this.error = err.error.errors
         this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Category is not created!'
         });
    })
   }
   
  }
  //merre id nga routi active, beje get qat category, vendose vlerat aktuale te category neper fields
  private checkMode() {
    const id = this.activeRoute.snapshot.paramMap.get("id")
    if (id) {
      this.isEditMode = true;
      this.categoryService.getCategory(parseInt(id)).subscribe((category: any) => {
        this.form.patchValue({
        name: category.name
      });
       })
    }
  }
}

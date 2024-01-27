import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { CategoryService } from 'src/app/auth/services/category.service';
import { ProductService } from 'src/app/auth/services/product.service';
import { Category } from 'src/app/shared/interfaces/category';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit{
  form!: FormGroup
  isEditMode = false
  categoryOptions$!:Observable<Category[]>
  error: any
  fileError: any //validimi ne controller (image is required)
  multerError:any // type and limits validation
  imageDisplay: any
  paramId:any
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private messageService: MessageService,
    private activeRoute: ActivatedRoute,
    private location: Location
  ) { }
  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(''),
      description: new FormControl(''),
      image: new FormControl(''),
      price: new FormControl(''),
      Category: new FormControl(''),
    });
    this.categoryOptions$ =  this.categoryService.getCategories()
    this.checkMode()
  }
  
  createProduct() {
    
    const formData = new FormData();
    formData.append('name', this.form.value.name)
    formData.append('description', this.form.value.description)
    formData.append('image', this.form.value.image)
    formData.append('Category', this.form.value.Category)
    formData.append('categoryId', this.form.value.Category.id)
    formData.append('price', this.form.value.price)
    console.log(formData.get('categoryId'));

    this.productService.createProduct(formData).subscribe((res: any) => {  
      this.removeErrors()
      console.log(res);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: res.message });
      setTimeout(() => {
        this.location.back()
      },2000)
    }, (err:any) => {
      this.removeErrors()
      console.log(err);
      this.error = err.error.errors
      this.fileError = err.error.message
      this.multerError = err.error.details
      this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Product is not created!'
         });
    })
    }
      
  updateProduct() {
    const formData = new FormData();
    formData.append('name', this.form.value.name)
    formData.append('description', this.form.value.description)
    formData.append('image', this.form.value.image)
    formData.append('Category', this.form.value.Category)
    formData.append('categoryId', this.form.value.Category.id)
    formData.append('price', this.form.value.price)
    this.productService.editProduct(this.paramId, formData).subscribe((res: any) => {
      this.removeErrors()
      console.log(res);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: res.message });
      
    }, err => {
      console.log(err);
      this.removeErrors()
      this.error = err.error.errors
      this.fileError = err.error.message
      this.multerError = err.error.details
      this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Product was not updated!'
         });
      })
    }
  
  
    onImageUpload(event:any) {
     const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ image: file });
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imageDisplay = fileReader.result;
      };
      fileReader.readAsDataURL(file);
    }
    }
  
  
   private checkMode() {
    const id = this.activeRoute.snapshot.paramMap.get("id")
    if (id) {
      this.isEditMode = true;
      this.paramId = id
      this.productService.getProduct(parseInt(id)).subscribe((product: any) => {
        console.log(product.image);
        this.form.patchValue({
          name: product.name,
          description: product.description,
          Category: product.Category,
          price: product.price,
          image: product.image,
        })
        this.imageDisplay = product.image
      })
    }
   }
  
 private removeErrors() {
    this.error = ''
   this.fileError = ''
   this.multerError =''
  }
}

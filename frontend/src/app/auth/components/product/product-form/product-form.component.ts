import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FileUploadEvent } from 'primeng/fileupload';
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

uploadedFiles: any;
onUpload($event: FileUploadEvent) {
  console.log($event);
  console.log(this.uploadedFiles);
}
  form!: FormGroup
  isEditMode = false
  categoryOptions$!:Observable<Category[]>
  error: any
  fileError: any //validimi ne controller (image is required)
  multerError:any // type and limits validation
  imageDisplay: any
  paramId: any
  imagesDisplay: any[] = []
  limitFiles: boolean = false
  mainImageMulterError: any
  additionalImagesMulterError:any
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
      Category: new FormControl('',),
      stock: new FormControl(0),
      Images: new FormControl([]),
      previewsImagesUrl: new FormControl([])
    });
    this.categoryOptions$ =  this.categoryService.getCategories()
    this.checkMode();
    setTimeout(() => {
    console.log('this.form.value.previewsImagesUrl INIT',this.form.value.previewsImagesUrl);
    }, 500);
    

  }
  
  createProduct() {
    const formData = new FormData();
    formData.append('name', this.form.value.name)
    formData.append('description', this.form.value.description)
    formData.append('mainImage', this.form.value.image)
    formData.append('Category', this.form.value.Category)
    formData.append('categoryId', this.form.value.Category.id)
    formData.append('price', this.form.value.price)
    formData.append('stock', this.form.value.stock)
     for (let image of this.form.value.Images) { 
      formData.append(`additionalImages`, image)
    }
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
    formData.append('mainImage', this.form.value.image)
    formData.append('Category', this.form.value.Category)
    formData.append('categoryId', this.form.value.Category.id)
    formData.append('price', this.form.value.price)
    formData.append('stock', this.form.value.stock)
    formData.append('previewsImagesUrl', JSON.stringify(this.form.value.previewsImagesUrl))
    for (let image of this.form.value.Images) { 
      formData.append(`additionalImages`, image)
    }

    this.productService.editProduct(this.paramId, formData).subscribe((res: any) => {
      this.removeErrors()
      console.log(res);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: res.message });
      
    }, err => {
      console.log(err);
      this.removeErrors()
      console.log(err);
      this.error = err.error.errors
      this.fileError = err.error.message
      this.multerError = err.error

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
  
  uploadAdditionalImg(event: any) {
    console.log('this.form.value.Images before', this.form.value.Images);
   

  this.limitFiles = false
  const files = event.target.files; 
  const totalImages = files.length  + this.imagesDisplay.length;
    if (totalImages > 5) {
    this.limitFiles = true
    return;
  }
  //this.form.patchValue({ Images: [...currentImages, ...files] });
    this.form.patchValue({ Images: [...this.form.value.Images, ...files] });
    console.log('patch values', this.form.value.Images);

  for (let i = 0; i < files.length; i++) {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      console.log('FileReader onload triggered');
      const imageData = { url: fileReader.result, file: files[i]};
      this.imagesDisplay.push(imageData);
    };
    fileReader.readAsDataURL(files[i]);
    this.form.value.previewsImagesUrl = this.imagesDisplay.filter(image => !image.file)
    console.log('this.form.value.Images after', this.form.value.Images);
    
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
          stock: product.stock,
          previewsImagesUrl: product.Images
        })
        this.imageDisplay = product.image
        this.imagesDisplay = product.Images
      })
    }
   }
  
 private removeErrors() {
   this.error = ''
   this.fileError = ''
   this.multerError =''
  }

  removeImage(img: any) { 
    console.log(img);
    console.log();
    this.imagesDisplay = this.imagesDisplay.filter(image => image.url !== img.url);
        this.form.value.previewsImagesUrl = this.imagesDisplay.filter(image => !image.file)

    console.log('this.form.value.Images before', this.form.value.Images);
    
     if (img.file) { // Remove the new file uploaded
       this.form.value.Images = this.form.value.Images.filter((image: any) => image !== img.file)
    }



    console.log('this.form.value.Images',this.form.value.Images);
    console.log('this.imagesDisplay', this.imagesDisplay);
    console.log('this.form.value.previewsImagesUrl', this.form.value.previewsImagesUrl);
  }
}

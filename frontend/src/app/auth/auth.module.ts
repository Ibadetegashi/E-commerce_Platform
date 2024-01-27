import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './components/register/register.component';
import { CardModule } from 'primeng/card';
import { RouterModule } from '@angular/router';
import { CategoriesComponent } from './components/category/categories/categories.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { AddCategoryComponent } from './components/category/add-category/add-category.component';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProductsComponent } from './components/product/products/products.component';
import { ProductFormComponent } from './components/product/product-form/product-form.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { UsersComponent } from './components/user/users/users.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SidebarComponent } from './partials/sidebar/sidebar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OrdersComponent } from './components/order/orders/orders.component';
import { OrderDetailsComponent } from './components/order/order-details/order-details.component';
import { TagModule } from 'primeng/tag';
import { FieldsetModule } from 'primeng/fieldset';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    CategoriesComponent,
    AddCategoryComponent,
    ProductsComponent,
    ProductFormComponent,
    UsersComponent,
    SidebarComponent,
    DashboardComponent,
    OrdersComponent,
    OrderDetailsComponent,
  

  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    CardModule,
    RouterModule,
    ButtonModule,
    TableModule,
    ToolbarModule,
    InputTextModule,
    ReactiveFormsModule,
    ToastModule,
    ConfirmDialogModule,
    DropdownModule,
    InputNumberModule,
    FileUploadModule,
    InputTextareaModule,
    InputSwitchModule,
    TagModule,
    BrowserModule,
    BrowserAnimationsModule,
    FieldsetModule
  
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
  ],
  providers:[MessageService,ConfirmationService]
})
export class AuthModule { }

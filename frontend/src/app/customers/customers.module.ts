import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './partials/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProductItemComponent } from './partials/product-item/product-item.component';
import { CardModule } from 'primeng/card';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import {  ToastModule } from 'primeng/toast';
import { BadgeModule } from 'primeng/badge';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import {  InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { ProfileComponent } from './pages/profile/profile.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MenubarModule } from 'primeng/menubar';
import { OrderHistoryDetailsComponent } from './pages/order-history-details/order-history-details.component';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatorModule } from 'primeng/paginator';
import { UnavailableProductsModalComponent } from './partials/unavailable-products-modal/unavailable-products-modal.component';

@NgModule({
  declarations: [
    HeaderComponent,
    HomeComponent,
    ProductsListComponent,
    ProductItemComponent,
    ProductDetailsComponent,
    CartComponent,
    CheckoutComponent,
    ProfileComponent,
    OrderHistoryComponent,
    OrderHistoryDetailsComponent,
    UnavailableProductsModalComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CardModule,
    InputNumberModule,
    FormsModule,
    ToastModule,
    BadgeModule,
    FormsModule,
    ReactiveFormsModule,
    InputSwitchModule,
    InputMaskModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    TableModule,
    TagModule,
    MenubarModule,
    ConfirmDialogModule,
    PaginatorModule
  ],
  exports: [],
  providers:[MessageService]
})
export class CustomersModule { }

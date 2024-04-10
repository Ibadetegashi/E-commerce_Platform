import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { AuthGuardService } from './auth/services/auth-guard.service';
import { AdminGuardService } from './auth/services/admin-guard.service';


import { CategoriesComponent } from './auth/components/category/categories/categories.component';
import { AddCategoryComponent } from './auth/components/category/add-category/add-category.component';
import { ProductsComponent } from './auth/components/product/products/products.component';
import { ProductFormComponent } from './auth/components/product/product-form/product-form.component';
import { UsersComponent } from './auth/components/user/users/users.component';
import { DashboardComponent } from './auth/pages/dashboard/dashboard.component';
import { HomeComponent } from './customers/pages/home/home.component';
import { ProductsListComponent } from './customers/pages/products-list/products-list.component';
import { ProductDetailsComponent } from './customers/pages/product-details/product-details.component';
import { CartComponent } from './customers/pages/cart/cart.component';
import { CheckoutComponent } from './customers/pages/checkout/checkout.component';
import { OrdersComponent } from './auth/components/order/orders/orders.component';
import { OrderDetailsComponent } from './auth/components/order/order-details/order-details.component';
import { ProfileComponent } from './customers/pages/profile/profile.component';
import { OrderHistoryComponent } from './customers/pages/order-history/order-history.component';

const routes: Routes = [
  {
    path: 'dashboard', component: DashboardComponent,
    canActivate: [AdminGuardService],
    children:
      [
        {
          path:'categories', component:CategoriesComponent
        },
          {
          path:'categories/add-category', component:AddCategoryComponent
        },
            {
          path:'categories/add-category/:id', component:AddCategoryComponent
        },
             {
          path:'products', component:ProductsComponent
        },
          {
          path:'products/product-form', component:ProductFormComponent
        },
              {
          path:'products/product-form/:id', component:ProductFormComponent
        },
                {
          path:'users', component:UsersComponent
        },
        {
          path:'orders', component: OrdersComponent
        },
        {
          path:'orders/order-details/:id', component: OrderDetailsComponent
        },
      ]
  },
  {
    path: '',
    component: HomeComponent,
    canActivate:[AuthGuardService],
    children: [
      {
       path: 'products',
      component: ProductsListComponent,
       
    },
      {
        path: 'details/:id',
        component:ProductDetailsComponent
      },
      {
        path: 'cart',
        component: CartComponent
      },
      {
        path: 'checkout',
        component: CheckoutComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
          {
        path: 'order-history',
        component: OrderHistoryComponent
      }
     
    ]
  },
   

  {
  path:'login', component:LoginComponent
  },
  {
  path:'register',component:RegisterComponent
  },
  {
    path: '**', redirectTo: '/login', pathMatch: 'full'
  },
 
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

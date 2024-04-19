import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ProductsListComponent } from '../products-list/products-list.component';
import { HeaderComponent } from '../../partials/header/header.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  // name!: string
  // handleChange(event: any) {
  //   this.name = event
  //   console.log(this.name);
  // }

  // onActivate(component: ProductsListComponent) {
  //   component.name = this.name || 'l' 
  // }
  
 
}

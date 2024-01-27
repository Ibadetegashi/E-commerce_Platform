import { Component } from '@angular/core';
import { CartService } from 'src/app/customers/services/cart.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  constructor(cartService: CartService) {
    // cartService.loadCart()
    // console.log('footer');
   }
  
  
}

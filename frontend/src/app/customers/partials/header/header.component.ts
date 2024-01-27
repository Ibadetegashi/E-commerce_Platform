import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  cartCount = 0
  isAdmin!: boolean
  
  constructor(private cartService: CartService, private authService: AuthService) {}
  ngOnInit(): void {
    this.isAdmin =   this.authService.isAdmin();
    this.cartService.cart$.subscribe((cart: any) => {
      this.cartCount = cart?.length ?? 0
    })
    
  }

  logOut() {
    this.authService.logout();
  }
  
  
 

}

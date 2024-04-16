import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MenuItem } from 'primeng/api';
import { NavigationEnd, Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
      isProfileActive: boolean = false;
    isOrderHistoryActive: boolean = false;
  cartCount = 0
  isAdmin!: boolean
   items: MenuItem[] | undefined;
  constructor(private cartService: CartService, private authService: AuthService, private router:Router) {}
  ngOnInit(): void {
    //this.cartService.loadCart()
    this.isAdmin =   this.authService.isAdmin();
    this.cartService.cart$.subscribe((cart: any) => {
      this.cartCount = cart?.length ?? 0
    })

   
    this.router.events.subscribe((event) => {
    // console.log('eventi',event);
      if (event instanceof NavigationEnd) {
        this.updateActiveStates();
      }
    });
  }
   private updateActiveStates() {
    const currentUrl = this.router.url;
    this.isProfileActive = currentUrl.includes('/profile');
    this.isOrderHistoryActive = currentUrl.includes('/order-history');
  }

  logOut() {
    this.authService.logout();
  }
  
  
 

}

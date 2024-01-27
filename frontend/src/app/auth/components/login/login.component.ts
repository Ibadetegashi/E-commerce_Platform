import { Component } from '@angular/core';
import { Form } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from 'src/app/customers/services/cart.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  
  email: any
  password: any
  errors: any //validation
  error:any //res.status...success false
  constructor(private auth: AuthService, private router: Router, private cartService:CartService) {
    if (auth.isLoggedIn()) {
      this.router.navigate(['products'])
    }
  }
  
  login() {
    console.log(this.email, this.password);
    this.auth.login(this.email, this.password).subscribe((res: any) => {
        this.emptyFormMsg()
        localStorage.setItem('token', res.token);
          if (this.auth.isAdmin()) {
          this.router.navigate(['/dashboard'])
        } else {
          this.router.navigate(['/products']);
      }
      this.cartService.loadCart()
        console.log(res);   
      }, (err:any) => {
        this.emptyFormMsg()
        this.errors = err.error.errors
        this.error = err.error
      })
    
  }

  emptyFormMsg() {
    this.errors = ''
    this.error = ''
  }
}

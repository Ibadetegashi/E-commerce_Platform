import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Register } from 'src/app/shared/interfaces/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.scss']
})
export class RegisterComponent {
  firstname = ''
  lastname = ''
  email = ''
  password = ''
  errors:any //validation for inputs
  error: any //bad request
  message:any //check email for confirm

   constructor(private auth: AuthService, private router: Router) {
    if (auth.isLoggedIn()) {
      this.router.navigate(['products'])
    }
  }
  
  register() {
    const data : Register = {
      firstname: this.firstname,
      lastname: this.lastname,
      password: this.password,
      email: this.email
    }
    this.auth.register(data).subscribe((res: any) => {
      this.emptyFormMessages()
      this.message = res.message
    }, (error: any) => {
      this.emptyFormMessages()
      console.log(error.error);
      this.error = error.error
      this.errors = error.error?.errors
    })
  }

  emptyFormMessages() {
    this.error = ''
    this.errors=''
    this.message =''
  }
}

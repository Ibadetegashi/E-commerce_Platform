import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UsersService } from 'src/app/auth/services/users.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
 
  form!: FormGroup;
  user: any
  email: any
  error: any
  emailMessage: any
  confirmEmail:any
 
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private messageService: MessageService
  ) { 
    this.initForm();
    this.getLoggedInUser();
  }
  
  initForm() {
    this.form = new FormGroup({
      firstname: new FormControl(''),
      lastname: new FormControl(''),
      password: new FormControl(''),
    })
  }
  initValue() {
     this.form = new FormGroup({
      firstname: new FormControl(this.user.firstname),
      lastname: new FormControl(this.user.lastname),
      password: new FormControl(''),
    })
  }

 async changeInfo() {
    const user = {
      firstname: this.form.value.firstname,
      lastname: this.form.value.lastname,
      password: this.form.value.password  || undefined
    }
    
    this.userService.updateUser(user, this.user.id).subscribe((res: any) => {
      console.log(res);
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Data updated.`
        });
      this.emptyError()
    }, (error: any) => {
      console.log(error);
      this.error=error.error.errors
    })
   }
  changeEmail() {
    this.userService.changeEmail(this.email, this.user.id).subscribe((res: any) => {
      console.log(res);
      this.confirmEmail = res.message
      this.emptyError()
    }, (error: any) => {
      console.log(error);
      this.error = error.error.errors
      this.emailMessage = error.error.message
    })
   }
  
  async getLoggedInUser() {
    this.userService.getUser(this.authService.getUserIdByToken()).subscribe((res: any) => {
      this.user = res.data
      this.email = res.data.email
      this.initValue()
      console.log(this.user);
    })
  }

  emptyError() {
    this.emailMessage = ''
    this.error = ''
  }
}

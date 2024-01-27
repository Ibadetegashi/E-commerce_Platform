import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { UsersService } from 'src/app/auth/services/users.service';
import { User } from 'src/app/shared/interfaces/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent{
  users$!: Observable<User[]>

  constructor(
    private usersService: UsersService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  
  ) {
    this.users$ = usersService.getUsers()
   }

  
   deleteUser(id: number) {
     this.confirmationService.confirm({
      message: 'Are you sure you want to delete this User?',
      header: 'Delete User',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usersService
          .deleteUser(id)
          .subscribe(
            (res:any) => {
              this.users$ = this.usersService.getUsers()
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: res.message
              });
            },
            (err) => {
              console.log(err);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: err.error.message
              });
            }
          );
      }
    });
   }
  
    updateUserAdminStatus(user: any) {
    const userId = user.id;
    const isAdmin = user.isAdmin; 

    this.usersService.makeUserAdmin(userId, isAdmin).subscribe(
      (res: any) => {
      console.log('Useeeeeer',user);
        console.log(res.message);
           this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: isAdmin ? 'User now is Admin' : 'User now is not Admin'
              });
        user.isAdmin = isAdmin; 
      },
      (error) => {
        console.error('Failed to update status:', error);
      }
    );
  }
}

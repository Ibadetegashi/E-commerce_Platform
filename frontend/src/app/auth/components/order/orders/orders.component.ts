import { Component } from '@angular/core';
import { OrderService } from 'src/app/auth/services/order.service';
import { UsersService } from 'src/app/auth/services/users.service';
import { STATUSES } from '../orderStatuses';
import { ConfirmationService, MessageService } from 'primeng/api';
 
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent {
  orders: any[] = []
  users: any[] = []
  statuses: { [key: string]: { severity: string; text: string } }= STATUSES
  constructor(
    private orderService: OrderService,
    private messageService: MessageService,
    private confirmationService:ConfirmationService
  ) {
    this.getOrders()
   }

  getOrders() {
    this.orderService.getOrders().subscribe((res: any) => {
      this.orders = res.data
      console.log(this.orders);
    })
  }

  
  deleteOrder(id: number) {
    this.confirmationService.confirm({
    message: 'Are you sure that you want to delte this order?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
      accept: () => this.orderService.deleteOrder(id).subscribe(
        (res: any) => {
          console.log(res);
           this.getOrders()
              this.messageService.add({
               severity: 'success',
               summary: 'Success',
               detail: `${res.message}`
              });
          }),
  }),
      (err: any) => {
      console.log(err);
      this.messageService.add({
            severity: 'danger',
            summary: 'Error',
            detail: `${err.message}`
        });
    }
  }
}

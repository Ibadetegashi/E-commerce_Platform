import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-order-history-details',
  templateUrl: './order-history-details.component.html',
  styleUrls: ['./order-history-details.component.scss']
})
export class OrderHistoryDetailsComponent implements OnInit {
  order: any
  orderId!: number
  orderItems: any

  constructor(
    private routeActive: ActivatedRoute,
    private orderService: OrderService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {

  }
  ngOnInit(): void {
    this.routeActive.params.subscribe((param: any) => {
      console.log("Param", param);
      this.orderId = param.id;
    })
    this.getOrderItems()
    this.getOrderDetails()
  }

  getOrderDetails() {
    this.orderService.getOrderDetails(this.orderId).subscribe((order:any) => {
      this.order = order.data;  
      console.log(this.order);
    }, err => {
      console.log(err);
    })
  }

  getOrderItems() {
    this.orderService.getOrderItems(this.orderId).subscribe((item: any) => {
      this.orderItems = item.data
      console.log('oderitems', this.orderItems);
    })
  }

  cancelOrder() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to cancel this order?',
      header: 'Delete Product',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.orderService
          .cancelOrder(this.orderId)
          .subscribe(
            (res:any) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: res.message
              });
              setTimeout(() => {
                this.router.navigate(['/order-history']);
               } ,1000);
              
            },
            (err) => {
              console.log(err);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: err.error.message
              });
            }
          , );
      }
    });
  }

  
}

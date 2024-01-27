import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/auth/services/order.service';
import { ProductService } from 'src/app/auth/services/product.service';
import { STATUSES } from '../orderStatuses';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent {
  orderId!: number
  order: any
  orderItems: any
  statuses: any
  selectedStatus:any
  constructor(
    private routerA: ActivatedRoute,
    private orderService: OrderService,
    private messageService: MessageService
  ) {
    this.getId()
    this.mapStatuses()
    this.getOrder()
    this.getOrderItems()
  }

  getOrder() {
    this.orderService.getOrder(this.orderId).subscribe((res: any) => {
      this.order = res.data
       this.selectedStatus  = res.data.status
      console.log(res);
    })
  }

  getOrderItems() {
    this.orderService.getOrderItems(this.orderId).subscribe((res: any) => {
      this.orderItems = res.data;
      console.log(this.orderItems);
     })
  }

  getId() {
      this.routerA.params.subscribe(res => {
      if (res['id']) {
        this.orderId = res['id'];
      }
        console.log(res);
    })
  }

    mapStatuses() {
      this.statuses = Object.keys(STATUSES).map((status) => {
        return {
          id:status,
          label: STATUSES[status as keyof typeof STATUSES].text,
        };
      });
    }
  
  changeStatus() {
    console.log(this.selectedStatus);
    this.orderService.changeOrderStatus(this.selectedStatus, this.orderId).subscribe((res: any) => {
      console.log(res);
       this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `${res.message}`
        });
    }, (err:any) => {
      console.log(err);
    })
  }
}
